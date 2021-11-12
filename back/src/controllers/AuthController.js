const { Op } = require("sequelize");
const User = require("../models/User");
const Auth = require("../config/auth");

const register = async (req, res) => {
  try {
    const { password } = req.body;
    const hashAndSalt = Auth.generatePassword(password);
    const salt = hashAndSalt.salt;
    const hash = hashAndSalt.hash;
    const newUserData = {
      cpf: req.body.cpf,
      pis: req.body.pis,
      name: req.body.name,
      email: req.body.email,
      hash: hash,
      salt: salt,
      country: req.body.country,
      state: req.body.state,
      city: req.body.city,
      postalCode: req.body.postalCode,
      street: req.body.street,
      number: req.body.number,
      additionalInfo: req.body.additionalInfo,
    };

    const isNotUnique = await User.findOne({
      where: {
        [Op.or]: [
          { cpf: newUserData.cpf },
          { pis: newUserData.pis },
          { email: newUserData.email },
        ],
      },
    });

    if (isNotUnique !== null) {
      throw new Error("Usuário já cadastrado!");
    }

    const user = await User.create(newUserData);
    const token = Auth.generateJWT(user);
    return res.status(201).json({
      message: "Usuário criado com sucesso!",
      user: user,
      token: token,
    });
  } catch (err) {
    return res.status(500).json({ error: err });
  }
};

const login = async (req, res) => {
  try {
    const loginId = req.body.loginId;
    let user;

    // Testa o loginId para ver por qual informação ele deve ser procurado na base
    if (/[A-Z0-9._%+-]+@[A-Z0-9-]+(\.[A-Z]{2,4})+/i.test(loginId)) {
      user = await User.findOne({ where: { email: loginId } });
    } else if (/\d{3}\.\d{3}\.\d{3}-\d{2}/i.test(loginId)) {
      user = await User.findOne({ where: { cpf: loginId } });
    } else if (/\d{3}\.\d{4}\.\d{3}-\d{1}/i.test(loginId)) {
      user = await User.findOne({ where: { pis: loginId } });
    }

    if (!user)
      return res.status(404).json({ message: "Usuário não encontrado." });
    const { password } = req.body;
    if (Auth.checkPassword(password, user.hash, user.salt)) {
      const token = Auth.generateJWT(user);
      return res.status(200).json({ token: token });
    } else {
      return res.status(401).json({ message: "Senha inválida" });
    }
  } catch (e) {
    return res.status(500).json({ err: e });
  }
};

const getDetails = async (req, res) => {
  try {
    const token = Auth.getToken(req);
    const payload = Auth.decodeJwt(token);
    const user = await User.findByPk(payload.sub); //pegar_informação_do_usuário_logado
    if (!user)
      return res.status(404).json({ message: "Usuário não encontrado." });
    return res.status(200).json({ user: user });
  } catch (e) {
    return res.status(500).json({ err: e });
  }
};

module.exports = {
  register,
  login,
  getDetails,
};
