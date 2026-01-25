import nodemailer from 'nodemailer';
import { PaymentOrder } from './types';

// 配置邮件传输器
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 465,
    secure: Number(process.env.SMTP_PORT) === 465, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

export async function sendOrderNotification(order: PaymentOrder) {
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.ADMIN_EMAIL) {
        console.log('Skipping email notification: SMTP settings missing');
        return;
    }

    try {
        const info = await transporter.sendMail({
            from: `"MoonTV Robot" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
            to: process.env.ADMIN_EMAIL,
            subject: `[MoonTV] 新订单待审核: ${order.order_no}`,
            html: `
        <h2>新会员订单通知</h2>
        <p>您有一个新的会员订单无需审核：</p>
        <ul>
          <li><strong>订单号:</strong> ${order.order_no}</li>
          <li><strong>用户:</strong> ${order.username}</li>
          <li><strong>金额:</strong> ¥${order.amount}</li>
          <li><strong>时间:</strong> ${new Date(order.created_at).toLocaleString('zh-CN')}</li>
        </ul>
        <p>请尽快前往后台审核：<a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/admin/orders">点击查看订单</a></p>
      `,
        });

        console.log('Order notification sent:', info.messageId);
    } catch (error) {
        console.error('Failed to send order notification:', error);
    }
}
