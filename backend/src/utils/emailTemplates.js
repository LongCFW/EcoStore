export const orderConfirmationTemplate = (order, userName) => {
    const itemsHtml = order.items.map(item => `
        <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">
                ${item.name} <br/>
                <span style="font-size: 12px; color: #777;">x${item.quantity}</span>
            </td>
            <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">
                ${(item.price_cents * item.quantity).toLocaleString()} đ
            </td>
        </tr>
    `).join('');

    return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
        <h2 style="color: #2e7d32; text-align: center;">Cảm ơn bạn đã đặt hàng! 🌿</h2>
        <p>Xin chào <strong>${userName}</strong>,</p>
        <p>Đơn hàng <strong>#${order.orderNumber}</strong> của bạn đã được tiếp nhận và đang xử lý.</p>
        
        <h3 style="border-bottom: 2px solid #2e7d32; padding-bottom: 5px;">Chi tiết đơn hàng</h3>
        <table style="width: 100%; border-collapse: collapse;">
            ${itemsHtml}
            <tr>
                <td style="padding: 10px; font-weight: bold;">Tổng cộng</td>
                <td style="padding: 10px; font-weight: bold; text-align: right; color: #2e7d32; font-size: 18px;">
                    ${order.totalAmount_cents.toLocaleString()} đ
                </td>
            </tr>
        </table>

        <div style="margin-top: 20px; background: #f9f9f9; padding: 15px; border-radius: 5px;">
            <p style="margin: 0;"><strong>Địa chỉ giao hàng:</strong> ${order.shippingAddress}</p>
            <p style="margin: 5px 0 0;"><strong>SĐT:</strong> ${order.phoneNumber}</p>
            <p style="margin: 5px 0 0;"><strong>Thanh toán:</strong> ${order.paymentMethod === 'cod' ? 'Tiền mặt khi nhận hàng (COD)' : order.paymentMethod}</p>
        </div>

        <p style="text-align: center; margin-top: 30px; font-size: 12px; color: #888;">
            Nếu có thắc mắc, vui lòng liên hệ hotline: 1900 xxxx.<br/>
            EcoStore - Sống xanh mỗi ngày.
        </p>
    </div>
    `;
};

export const otpTemplate = (otpCode, type = 'register') => {
    const title = type === 'register' ? "Xác thực tài khoản EcoStore" : "Khôi phục mật khẩu EcoStore";
    const desc = type === 'register' 
        ? "Cảm ơn bạn đã đăng ký tài khoản tại EcoStore. Vui lòng sử dụng mã OTP dưới đây để hoàn tất quá trình đăng ký."
        : "Chúng tôi nhận được yêu cầu khôi phục mật khẩu của bạn. Vui lòng sử dụng mã OTP dưới đây để thiết lập mật khẩu mới.";

    return `
    <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; text-align: center;">
        <h2 style="color: #2e7d32;">${title} 🌿</h2>
        <p style="color: #555; line-height: 1.5;">${desc}</p>
        <div style="margin: 30px 0; padding: 20px; background-color: #f1f8e9; border-radius: 8px;">
            <span style="display: block; font-size: 14px; color: #2e7d32; margin-bottom: 10px;">Mã xác thực của bạn (Có hiệu lực 5 phút)</span>
            <strong style="font-size: 32px; color: #1b5e20; letter-spacing: 8px;">${otpCode}</strong>
        </div>
        <p style="font-size: 13px; color: #888;">Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email và bảo mật tài khoản của mình.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="font-size: 12px; color: #aaa;">EcoStore - Sống xanh mỗi ngày.</p>
    </div>
    `;
};

export const paymentLinkTemplate = (order, userName, checkoutUrl) => {
    const itemsHtml = order.items.map(item => `
        <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">
                ${item.name} <br/>
                <span style="font-size: 12px; color: #777;">x${item.quantity}</span>
            </td>
            <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">
                ${(item.price_cents * item.quantity).toLocaleString()} đ
            </td>
        </tr>
    `).join('');

    return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
        <h2 style="color: #2e7d32; text-align: center;">Hướng dẫn thanh toán đơn hàng 🌿</h2>
        <p>Xin chào <strong>${userName}</strong>,</p>
        <p>Bạn vừa tạo đơn <strong>#${order.orderNumber}</strong>. Vui lòng hoàn tất thanh toán bằng cách mở đường dẫn bên dưới (chứa mã QR / hướng dẫn chuyển khoản):</p>
        <p style="text-align:center; margin: 20px 0;"><a href="${checkoutUrl}" style="background:#2e7d32;color:#fff;padding:12px 20px;border-radius:8px;text-decoration:none;">Mở link thanh toán</a></p>

        <h3 style="border-bottom: 2px solid #2e7d32; padding-bottom: 5px;">Chi tiết đơn hàng</h3>
        <table style="width: 100%; border-collapse: collapse;">
            ${itemsHtml}
            <tr>
                <td style="padding: 10px; font-weight: bold;">Tổng cộng</td>
                <td style="padding: 10px; font-weight: bold; text-align: right; color: #2e7d32; font-size: 18px;">
                    ${order.totalAmount_cents.toLocaleString()} đ
                </td>
            </tr>
        </table>

        <p style="font-size:12px;color:#666;margin-top:18px;">Lưu ý: Link thanh toán có thể hết hạn; nếu có vấn đề vui lòng liên hệ support.</p>
        <p style="text-align:center; margin-top: 20px; font-size: 12px; color: #888;">EcoStore - Sống xanh mỗi ngày.</p>
    </div>
    `;
};

export const adminOrderNotificationTemplate = (order, paymentMethod, checkoutUrl, user) => {
    const itemsHtml = order.items.map(item => `
        <tr>
            <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.name} x${item.quantity}</td>
            <td style="padding: 8px; border-bottom: 1px solid #eee; text-align:right;">${(item.price_cents * item.quantity).toLocaleString()} đ</td>
        </tr>
    `).join('');

    return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin:0 auto; padding:20px;">
        <h3>Thông báo đơn hàng mới: ${order.orderNumber}</h3>
        <p>Khách: <strong>${user?.name || 'Khách hàng'}</strong> - ${user?.email || 'Không có email'}</p>
        <p>Phương thức: <strong>${paymentMethod === 'banking' ? 'VietQR / Chuyển khoản' : 'COD'}</strong></p>
        ${checkoutUrl ? `<p>Link thanh toán: <a href="${checkoutUrl}">${checkoutUrl}</a></p>` : ''}
        <h4>Chi tiết</h4>
        <table style="width:100%;">${itemsHtml}</table>
        <p style="font-weight:bold;">Tổng: ${order.totalAmount_cents.toLocaleString()} đ</p>
    </div>
    `;
};