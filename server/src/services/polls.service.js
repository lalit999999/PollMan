import { Poll } from "../models/index.js";

export async function getUserPolls(userId, filters = {}) {
    const {
        status = null,
        search = "",
        sort = "-createdAt",
        limit = 10,
        skip = 0,
    } = filters;

    const query = {};

    // Filter by status
    if (status) {
        query.status = status;
    }

    // Search by title or description
    if (search) {
        query.$or = [
            { title: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } },
        ];
    }

    const polls = await Poll.find(query)
        .sort(sort)
        .limit(limit)
        .skip(skip)
        .select("-__v");

    const total = await Poll.countDocuments(query);

    return {
        polls,
        total,
        page: Math.floor(skip / limit) + 1,
        pages: Math.ceil(total / limit),
    };
}

export function validateCreatePollPayload(data) {
    const errors = [];

    if (!data.title || !data.title.trim()) {
        errors.push("Poll title is required");
    }

    if (data.title && data.title.length > 200) {
        errors.push("Poll title must be less than 200 characters");
    }

    if (!Array.isArray(data.questions) || data.questions.length === 0) {
        errors.push("At least one question is required");
    }

    if (Array.isArray(data.questions)) {
        data.questions.forEach((q, index) => {
            if (!q.text || !q.text.trim()) {
                errors.push(`Question ${index + 1}: text is required`);
            }

            if (!Array.isArray(q.options) || q.options.length < 2) {
                errors.push(
                    `Question ${index + 1}: at least 2 options are required`,
                );
            }

            if (Array.isArray(q.options)) {
                q.options.forEach((opt, optIndex) => {
                    if (!opt.text || !opt.text.trim()) {
                        errors.push(
                            `Question ${index + 1}, Option ${optIndex + 1}: text is required`,
                        );
                    }
                });
            }
        });
    }

    if (data.expiresAt && new Date(data.expiresAt) < new Date()) {
        errors.push("Expiry date must be in the future");
    }

    return { valid: errors.length === 0, errors };
}

export function validateResponsePayload(data) {
    const errors = [];

    if (!Array.isArray(data.answers) || data.answers.length === 0) {
        errors.push("At least one answer is required");
    }

    if (Array.isArray(data.answers)) {
        data.answers.forEach((a, index) => {
            if (!a.questionId) {
                errors.push(`Answer ${index + 1}: questionId is required`);
            }

            if (!a.selectedOption || !a.selectedOption.trim()) {
                errors.push(`Answer ${index + 1}: selectedOption is required`);
            }
        });
    }

    return { valid: errors.length === 0, errors };
}
