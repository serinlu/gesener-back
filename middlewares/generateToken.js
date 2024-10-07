import jwt from 'jsonwebtoken';

const generateToken = (id, role) => {
    console.log(id, role)
    return jwt.sign({ _id: id, role }, process.env.JWT_SECRET, {
        expiresIn: "30d",
    });
}

export default generateToken;