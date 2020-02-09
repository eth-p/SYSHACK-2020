import BountyId from "$bounty/BountyId";

/**
 * A bounty request.
 */
export default interface BountyRequest<Reward> {
	authorId: string,
	authorName: string,
	timestamp?: number,
	id?: BountyId,
	bounty: string,
	reward: Reward
}
