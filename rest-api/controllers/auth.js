const Auth = require("../models/auth.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.SECRET_TOKEN, { expiresIn: 3600 }); // expiresIn 3600 saniye (1 saat)
};

const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const user = await Auth.findOne({ email });
        if (user) {
            return res.status(500).json({ message: "Bu email daha önceden kaydolmuş" });
        }
        if (password.length < 6) {
            return res.status(500).json({ message: "Parola 6 karakterden fazla olmalıdır." });
        }
        const passwordHash = await bcrypt.hash(password, 12);
        const newUser = await Auth.create({ username, email, password: passwordHash });
        const userToken = generateToken(newUser.id);
        res.status(201).json({
            status: "OK",
            newUser,
            userToken
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await Auth.findOne({ email });
        if (!user) {
            return res.status(500).json({ message: "Böyle bir kullanıcı yok" });
        }
        const comparePassword = await bcrypt.compare(password, user.password);
        if (!comparePassword) {
            return res.status(500).json({ message: "Yanlış şifre" });
        }
        const token = generateToken(user.id);
        res.status(200).json({
            status: "OK",
            user,
            token
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

module.exports = { login, register };
