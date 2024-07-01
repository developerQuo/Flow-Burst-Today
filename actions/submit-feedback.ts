export async function submitFeedback(formData: FormData) {
    const rawFormData = {
        email: formData.get("email"),
        category: formData.get("category"),
        content: formData.get("content"),
    };

    return { success: true };
}
