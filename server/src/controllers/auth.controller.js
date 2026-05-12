import { generateTokens } from "../services/jwt.service.js";

export function googleAuth(req, res, next) {
    // Handled by Passport
    next();
}

export function googleAuthCallback(req, res) {
    if (!req.user) {
        return res.redirect(`${process.env.CLIENT_URL}/auth/login?error=auth_failed`);
    }

    const { accessToken, refreshToken } = generateTokens(req.user._id);

    // Redirect to frontend with tokens
    const redirectUrl = new URL(`${process.env.CLIENT_URL}/auth/success`);
    redirectUrl.searchParams.append("accessToken", accessToken);
    redirectUrl.searchParams.append("refreshToken", refreshToken);
    redirectUrl.searchParams.append("user", JSON.stringify(req.user));

    res.redirect(redirectUrl.toString());
}

export function githubAuth(req, res, next) {
    // Handled by Passport
    next();
}

export function githubAuthCallback(req, res) {
    if (!req.user) {
        return res.redirect(`${process.env.CLIENT_URL}/auth/login?error=auth_failed`);
    }

    const { accessToken, refreshToken } = generateTokens(req.user._id);

    // Redirect to frontend with tokens
    const redirectUrl = new URL(`${process.env.CLIENT_URL}/auth/success`);
    redirectUrl.searchParams.append("accessToken", accessToken);
    redirectUrl.searchParams.append("refreshToken", refreshToken);
    redirectUrl.searchParams.append("user", JSON.stringify(req.user));

    res.redirect(redirectUrl.toString());
}

export function logout(req, res) {
    req.logout((err) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: "Logout failed",
                error: err.message,
            });
        }

        return res.status(200).json({
            success: true,
            message: "Logged out successfully",
        });
    });
}

export function getMe(req, res) {
    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: "Not authenticated",
        });
    }

    return res.status(200).json({
        success: true,
        data: req.user,
    });
}
