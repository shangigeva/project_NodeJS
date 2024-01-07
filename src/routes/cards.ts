import { Router } from "express";
import { Card } from "../database/model/cards";
import { auth } from "../service/auth-service";
import { validateCard } from "../middleware/validation";
import { ICard, ICardInput } from "../@types/card";
import { isBusinessUser } from "../middleware/is-business";
import { validateToken } from "../middleware/validate-token";
import { BizCardsError } from "../error/biz-cards-error";
import { createCard } from "../service/card-service";
import { isUser } from "../middleware/is-user";
import { isAdminOrUser } from "../middleware/is-admin-or-user";
import { isAdmin } from "../middleware/is-admin";

const router = Router();
// CREATE CARD
router.post("/", isBusinessUser, validateCard, async (req, res, next) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      throw new BizCardsError("User must have an id", 500);
    }
    const saveCard = await createCard(req.body as ICardInput, userId);
    res.status(201).json({ message: "card saved", user: saveCard });
  } catch (e) {
    next(e);
  }
});
// GET ALL CARDS
router.get("/", async (req, res, next) => {
  try {
    const allCards = await Card.find();
    return res.json(allCards);
  } catch (e) {
    next(e);
  }
});

// GET MY CARDS
router.get("/my-cards", validateToken, async (req, res, next) => {
  try {
    const userId = req.user?._id!;
    const cards = await Card.find({ userId });
    return res.json(cards);
  } catch (e) {
    next(e);
  }
});
// GET CARD BY ID
router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const card = await Card.findById(id);
    return res.json(card);
  } catch (e) {
    next(e);
  }
});
// EDIT CARD
router.put("/:id", isBusinessUser, validateCard, async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user?._id;
    if (!userId) {
      throw new BizCardsError("User must have an id", 500);
    }
    const card = await Card.findOneAndUpdate({ _id: id, userId }, req.body, {
      new: true,
    });
    if (!card) {
      return res
        .status(404)
        .json({ error: "Card not found or user does not have permission" });
    }
    res.json({ card });
  } catch (e) {
    next(e);
  }
});
// DELETE CARD
router.delete("/:id", isAdminOrUser, async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleteCard = await Card.findByIdAndDelete({ _id: id });
    return res.json(deleteCard);
  } catch (e) {
    next(e);
  }
});
// LIKE CARD
router.patch("/:id", validateToken, async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user?._id;
    if (!userId) {
      throw new BizCardsError("User must have an id", 500);
    }
    const card = await Card.findById(id);
    if (!card) {
      return res.status(404).json({ error: "Card not found" });
    }
    card.likes.push(userId);
    await card.save();
    res.json({ card });
  } catch (e) {
    next(e);
  }
});
// CHANGE BIZNUMBER
router.patch("/:id/changeBizNum", isAdmin, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { bizNumber } = req.body;
    if (!bizNumber) {
      return res
        .status(400)
        .json({ error: "bizNumber is required for PATCH request" });
    }
    const card = await Card.findOneAndUpdate(
      { _id: id },
      { bizNumber },
      {
        new: true,
      }
    );
    if (!card) {
      return res
        .status(404)
        .json({ error: "Card not found or user does not have permission" });
    }
    res.json({ card });
  } catch (e) {
    next(e);
  }
});
export { router as cardRouter };
