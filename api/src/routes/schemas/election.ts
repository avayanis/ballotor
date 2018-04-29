export const electionVoteSchema = {
  body: {
    type: "object",
    properties: {
      candidate_id: { type: "string" }
    },
    required: ["candidate_id"]
  }
};
