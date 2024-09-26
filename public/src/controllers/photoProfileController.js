const User = require('../models/LoginModel'); // Importa o modelo de login 

const updateProfileImage = async (req, res) => {
  const { userId, image } = req.body;

  if (!userId || !image) {
    return res.status(400).json({ error: "Faltando userId ou imagem" });
  }

  try {
    // Atualiza o usuário no banco de dados com a imagem
    const user = await User.findByIdAndUpdate(userId, { profileImage: image }, { new: true });

    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    res.status(200).json({ message: 'Imagem carregada com sucesso', user });
  } catch (error) {
    console.error('Erro ao atualizar imagem:', error);
    res.status(500).json({ error: 'Erro ao atualizar imagem' });
  }
};

module.exports = { updateProfileImage };
