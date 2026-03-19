import Order from "../models/order.js";
import Cart from "../models/cart.js";
import Product from "../models/product.js";
import User from "../models/user.js"; // Import thêm User để lấy email
import sendEmail from "../utils/sendEmail.js"; // Import hàm gửi mail
import { orderConfirmationTemplate, adminOrderNotificationTemplate } from "../utils/emailTemplates.js";
import payOS from "../utils/payos.js";

// --- CLIENT: TẠO ĐƠN HÀNG ---
export const createOrderService = async (userId, orderData) => {
    const cart = await Cart.findOne({ userId });
    if (!cart || cart.items.length === 0) throw new Error("Giỏ hàng trống");

    const { selectedItemIds, shippingAddress, phoneNumber, note, paymentMethod } = orderData;

    if (!selectedItemIds || selectedItemIds.length === 0) {
        throw new Error("Không có sản phẩm nào được chọn để thanh toán");
    }

    let totalAmount_cents = 0;
    const orderItems = [];

    const itemsToCheckout = cart.items.filter(item =>
        selectedItemIds.includes(item.productId.toString())
    );

    if (itemsToCheckout.length === 0) throw new Error("Sản phẩm đã chọn không còn trong giỏ hàng");

    for (const item of itemsToCheckout) {
        const product = await Product.findById(item.productId);
        if (!product) throw new Error(`Sản phẩm không tồn tại: ${item.productId}`);
        const variant = product.variants?.[0];
        if (!variant) throw new Error(`Sản phẩm ${product.name} lỗi dữ liệu`);
        if (variant.stock < item.quantity) throw new Error(`Sản phẩm ${product.name} đã hết hàng`);

        variant.stock -= item.quantity;
        await product.save();

        orderItems.push({
            productId: product._id,
            name: product.name,
            price_cents: variant.price_cents,
            image: product.images?.[0]?.imageUrl || "",
            quantity: item.quantity
        });

        totalAmount_cents += variant.price_cents * item.quantity;
    }

    const SHIPPING_FEE = 30000;
    const FREESHIP_THRESHOLD = 300000;
    let finalTotal = totalAmount_cents;
    if (totalAmount_cents < FREESHIP_THRESHOLD) finalTotal += SHIPPING_FEE;

    // Rút gọn OrderNumber để khớp yêu cầu PayOS (Tối đa 12 số)
    const orderNumberStr = Date.now().toString().slice(-8) + Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    // PayOS yêu cầu orderCode phải là SỐ NGUYÊN (Integer)
    const payosOrderCode = Number(orderNumberStr);

    const newOrder = await Order.create({
        userId,
        orderNumber: `ORD-${orderNumberStr}`,
        payosOrderCode: payosOrderCode, // Lưu thêm cột này để lát nữa đối soát
        items: orderItems,
        totalAmount_cents: finalTotal,
        shippingAddress: shippingAddress,
        phoneNumber: phoneNumber,
        note: note,
        paymentMethod: paymentMethod || "COD",
        status: "pending" // Chưa thanh toán
    });

    const user = await User.findById(userId);

    // XỬ LÝ THANH TOÁN (COD vs BANKING)
    if (paymentMethod === 'banking') {
        // --- 1. NẾU LÀ CHUYỂN KHOẢN PAYOS ---
        const YOUR_DOMAIN = process.env.YOUR_DOMAIN || "http://localhost:5173";

        // PayOS yêu cầu mô tả (description) tối đa 25 kí tự => rút gọn an toàn
        const shortDescription = (`Thanh toan ${newOrder.orderNumber}`).slice(0, 25);

        const body = {
            orderCode: payosOrderCode,
            amount: finalTotal,
            description: shortDescription,
            items: orderItems.map(item => ({
                name: item.name.substring(0, 20), // Tránh tên quá dài
                quantity: item.quantity,
                price: item.price_cents
            })),
            returnUrl: `${YOUR_DOMAIN}/checkout/success`, // Thanh toán xong quăng về đây
            cancelUrl: `${YOUR_DOMAIN}/cart`              // Hủy thanh toán quăng về đây
        };

        try {
            const paymentLinkRes = await payOS.paymentRequests.create(body);

            // Gửi email hướng dẫn thanh toán cho khách (kèm checkoutUrl)
            if (user && user.email) {
                sendEmail({
                    email: user.email,
                    subject: `Hướng dẫn thanh toán cho đơn ${newOrder.orderNumber}`,
                    html: orderConfirmationTemplate(newOrder, user.name || 'Khách hàng')
                        .replace('</div>', `
                            <p style="text-align:center; margin-top:10px;"><a href=\"${paymentLinkRes.checkoutUrl}\" style=\"background:#2e7d32;color:#fff;padding:10px 14px;border-radius:6px;text-decoration:none;\">Mở link thanh toán</a></p>
                        </div>`)
                }).catch(err => console.error('⚠️ Lỗi gửi mail khách (link):', err.message));
            }

            // Gửi email báo admin có đơn mới (pending)
            const adminEmail = process.env.ADMIN_EMAIL;
            if (adminEmail) {
                sendEmail({
                    email: adminEmail,
                    subject: `Đơn mới ${newOrder.orderNumber} - Chờ thanh toán`,
                    html: adminOrderNotificationTemplate(newOrder, 'banking', paymentLinkRes.checkoutUrl, user)
                }).catch(err => console.error('⚠️ Lỗi gửi mail admin (new order):', err.message));
            }

            return {
                order: newOrder,
                checkoutUrl: paymentLinkRes.checkoutUrl // URL chứa mã QR
            };
        } catch (error) {
            console.error("Lỗi tạo link PayOS:", error);
            throw new Error("Không thể tạo link thanh toán, vui lòng thử lại sau");
        }

    } else {
        // --- 2. NẾU LÀ COD ---

        // XÓA GIỎ HÀNG
        cart.items = cart.items.filter(item => !selectedItemIds.includes(item.productId.toString()));
        await cart.save();

        if (user) {
            user.activityLogs.push({
                action: "ĐẶT HÀNG THÀNH CÔNG (COD)",
                details: `Đã đặt đơn #${newOrder.orderNumber} trị giá ${finalTotal.toLocaleString()}đ.`
            });
            await user.save();
        }

        if (user && user.email) {
            sendEmail({
                email: user.email,
                subject: `Xác nhận đơn hàng #${newOrder.orderNumber} - EcoStore`,
                html: orderConfirmationTemplate(newOrder, user.name || "Khách hàng"),
            }).catch(err => console.error("⚠️ Lỗi gửi mail:", err.message));
        }

            // Gửi thông báo cho admin khi có đơn COD mới
            const adminEmail = process.env.ADMIN_EMAIL;
            if (adminEmail) {
                sendEmail({
                    email: adminEmail,
                    subject: `Đơn mới ${newOrder.orderNumber} - COD`,
                    html: adminOrderNotificationTemplate(newOrder, 'cod', null, user)
                }).catch(err => console.error('⚠️ Lỗi gửi mail admin (COD):', err.message));
            }

        return { order: newOrder }; // COD thì chỉ trả về Order, không có URL
    }
};

// --- CLIENT: LẤY ĐƠN HÀNG CỦA TÔI ---
export const getMyOrdersService = async (userId) => {
    return await Order.find({ userId }).sort({ createdAt: -1 }); // Mới nhất lên đầu
};

// --- ADMIN: LẤY TẤT CẢ ĐƠN HÀNG ---
export const getAllOrdersService = async (query) => {
    // query có thể là ?status=pending hoặc ?page=1
    const filter = {};
    if (query.status && query.status !== 'all') {
        filter.status = query.status;
    }

    const orders = await Order.find(filter)
        .populate('userId', 'name email') // Lấy thêm tên người mua
        .sort({ createdAt: -1 });

    return orders;
};

// --- ADMIN: CẬP NHẬT TRẠNG THÁI ---
export const updateOrderStatusService = async (orderId, status) => {
    const order = await Order.findByIdAndUpdate(
        orderId,
        { status },
        { new: true }
    );
    if (!order) throw new Error("Order not found");
    return order;
};

// LẤY ĐƠN HÀNG CỦA MỘT USER CỤ THỂ 
export const getOrdersByUserIdForAdmin = async (userId) => {
    return await Order.find({ userId }).sort({ createdAt: -1 });
};

// --- PAYOS WEBHOOK: NHẬN THÔNG BÁO TỪ NGÂN HÀNG ---
export const handlePayOSWebhookService = async (webhookBody) => {
    try {
        // Sử dụng API SDK để verify webhook data
        const data = await payOS.webhooks.verify(webhookBody);

        if (data.code === "00") {
            const order = await Order.findOne({ payosOrderCode: data.orderCode });

            if (order && order.paymentStatus !== "paid") {
                // 1. Cập nhật trạng thái tự động
                order.paymentStatus = "paid";
                order.status = "confirmed";

                order.statusHistory.push({
                    status: "confirmed",
                    note: "Hệ thống tự động xác nhận: Khách đã chuyển khoản qua VietQR (PayOS)"
                });

                await order.save();

                // 2. XÓA ĐỒ TRONG GIỎ HÀNG
                const cart = await Cart.findOne({ userId: order.userId });
                if (cart) {
                    const purchasedProductIds = order.items.map(item => item.productId.toString());
                    cart.items = cart.items.filter(item => !purchasedProductIds.includes(item.productId.toString()));
                    await cart.save();
                }

                // 3. Gửi email xác nhận đã thanh toán cho khách
                const buyer = await User.findById(order.userId);
                if (buyer && buyer.email) {
                    sendEmail({
                        email: buyer.email,
                        subject: `Đơn ${order.orderNumber} đã được thanh toán`,
                        html: orderConfirmationTemplate(order, buyer.name || 'Khách hàng')
                    }).catch(err => console.error('⚠️ Lỗi gửi mail khách (paid):', err.message));
                }

                // 4. Thông báo admin
                const adminEmail = process.env.ADMIN_EMAIL;
                if (adminEmail) {
                    sendEmail({
                        email: adminEmail,
                        subject: `Đơn ${order.orderNumber} đã thanh toán`,
                        html: adminOrderNotificationTemplate(order, order.paymentMethod, null, buyer)
                    }).catch(err => console.error('⚠️ Lỗi gửi mail admin (paid):', err.message));
                }

                console.log(`[PAYOS WEBHOOK] Đơn hàng ${order.orderNumber} đã thanh toán thành công và đã dọn giỏ hàng!`);
            }
        }

        return { success: true };
    } catch (error) {
        console.error("[PAYOS WEBHOOK] Lỗi xác thực:", error.message || error);
        throw new Error("Invalid Webhook");
    }
};