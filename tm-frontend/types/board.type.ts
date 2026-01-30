export type Background = {
   type: "color" | "image",
    value: string;
}

export interface CreateBoardPayload {
  title: string;
  background: Background
}