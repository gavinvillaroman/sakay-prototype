"use client";
import { create } from "zustand";
import { user, type Review } from "./mock";

type State = {
  userReviews: Review[];
  addReview: (r: Omit<Review, "id" | "reviewerName" | "reviewerPhoto" | "date">) => void;
};

export const useReviewStore = create<State>((set) => ({
  userReviews: [],
  addReview: (r) =>
    set((s) => ({
      userReviews: [
        {
          id: `u-${Date.now()}`,
          reviewerName: `${user.firstName} ${user.lastName.charAt(0)}.`,
          reviewerPhoto: user.photo,
          date: "Just now",
          ...r,
        },
        ...s.userReviews,
      ],
    })),
}));
