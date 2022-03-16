const { Router } = require("express");
const { User, Post, Review } = require("../db");
const { checkUUIDV } = require("../services/checkUUID");
const { infoTotalDb } = require("../services/getDb");
const { search } = require("../services/login");
const {
  searchUserIncludingReview,
  ratingAverage,
  } = require("../services/ratingCalculation");
const { Update } = require("../services/updateUser");

const router = Router();

router.get("/profile/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    if (await checkUUIDV(id)) {
      const user = await User.findOne({
        where: {
          id,
        },
        include: [
          {
            model: Post,
            as: "posteos",
          },
          {
            model: Review,
            as: "reviews",
          },
        ],
      });
      if (user) {
        res.send(user);
      } else {
        return res.status(400).send("El usuario no existe");
      }
    } else {
      return res.status(400).send("El usuario no existe");
    }
  } catch (error) {
    next(error);
  }
});

router.get("/", async (req, res) => {
  const infoUser = await infoTotalDb();
  res.send(infoUser);
});

/*         Update Rating          */
router.put("/rate", async (req, res, next) => {
  const { email } = req.body;
  
  const user = await searchUserIncludingReview(email);
  const new_rating = ratingAverage(user);
  const updated = await Update({ rating: new_rating, email });
  
  res.send(updated);
});

/*         Account Delete          */
router.delete("/delete/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedUser = await User.destroy({
      where: { id },
    });
    res.send('Usuario eliminado con éxito');
  } catch (error) {
    res.status(400).send("No se pudo eliminar el usuario");
  }
});

module.exports = router;
