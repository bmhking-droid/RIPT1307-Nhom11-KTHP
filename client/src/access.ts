export default function access(initialState: any) {
  const { currentUser } = initialState || {};

  return {
    isAdmin: currentUser && currentUser.role === 'ADMIN',
    isCandidate: currentUser && currentUser.role === 'CANDIDATE',
  };
}