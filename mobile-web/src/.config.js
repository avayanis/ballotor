// export default {
//   oidc: {
//     clientId: "0oaeuuhclmLVMaQUc0h7",
//     issuer: "https://dev-459696.oktapreview.com/oauth2/default",
//     redirectUri: "http://192.168.43.142:8080",
//     scope: "openid profile email"
//   },
//   resourceServer: {
//     electionsUrl: "http://192.168.43.142:3000/api/v1/elections",
//     specificElectionUrl:
//       "http://192.168.43.142:3000/api/v1/elections/:electionId",
//     electionCandidatesUrl:
//       "http://192.168.43.142:3000/api/v1/elections/:electionId/candidates"
//   }
// };

export default {
  oidc: {
    clientId: "0oaeupt55dZBliF5Z0h7",
    issuer: "https://dev-459696.oktapreview.com/oauth2/default",
    redirectUri: "http://localhost:8080/auth.html",
    scope: "openid profile email"
  },
  resourceServer: {
    electionsUrl: "http://localhost:3000/api/v1/elections",
    specificElectionUrl: "http://localhost:3000/api/v1/elections/:electionId",
    electionCandidatesUrl:
      "http://localhost:3000/api/v1/elections/:electionId/candidates",
    specificCandidateUrl:
      "http://localhost:3000/api/v1/candidates/:candidateId",
    submitVoteUrl: "http://localhost:3000/api/v1/elections/:electionId/vote"
  }
};
