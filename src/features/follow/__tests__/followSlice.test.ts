import followReducer, { 
  toggleFollowState, 
  addFollowing, 
  removeFollowing 
} from "../followSlice";

describe("followSlice reducers", () => {
  const initial = {
    followers: [],
    following: [],
    followersCount: 0,
    followingCount: 0,
    loading: false,
    error: null,
  };

  it("should toggle follow state", () => {
    const state = {
      ...initial,
      followers: [
        { id: 1, username: "rangga", full_name: "Rangga", isFollowedByMe: false }
      ]
    };

    const result = followReducer(
      state,
      toggleFollowState({ userId: 1, isFollowed: true })
    );

    expect(result.followers[0].isFollowedByMe).toBe(true);
    expect(result.followingCount).toBe(1);
  });

  it("should add following", () => {
    const user = { id: 2, username: "rio", full_name: "Rio", isFollowedByMe: false };

    const result = followReducer(initial, addFollowing(user));

    expect(result.following.length).toBe(1);
    expect(result.following[0].id).toBe(2);
  });

  it("should remove following", () => {
    const state = {
      ...initial,
      following: [
        { id: 3, username: "andre", full_name: "Andre", isFollowedByMe: true }
      ]
    };

    const result = followReducer(state, removeFollowing(3));

    expect(result.following.length).toBe(0);
  });
});
