'use server';

export async function verifyAdmin(username?: string, password?: string) {
    if (!username || !password) {
        return { success: false, error: 'Username and password are required.' };
    }

    const validUsername = process.env.ADMIN_USERNAME;
    const validPassword = process.env.ADMIN_PASSWORD;

    if (!validUsername || !validPassword) {
        console.error("ADMIN_USERNAME or ADMIN_PASSWORD not set in environment.");
        return { success: false, error: 'Server configuration error.' };
    }

    if (username === validUsername && password === validPassword) {
        return { success: true };
    }

    return { success: false, error: 'Invalid credentials.' };
}
