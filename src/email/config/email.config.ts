import { registerAs } from "@nestjs/config";

export default registerAs ('email', () => ({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
}))