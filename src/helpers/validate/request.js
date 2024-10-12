function validateRequestBody(requiredFields, body) {
    const missingFields = requiredFields.filter(field => !body[field]);
    if (missingFields.length > 0) {
        return `Missing required fields: ${missingFields.join(', ')}`;
    }
    return null;
}

module.exports = {
    validateRequestBody,
};