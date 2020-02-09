/**
 * A bounty.
 */
import BountyId from "$bounty/BountyId";
import BountyRequest from "$bounty/BountyRequest";

export default class Bounty<Reward> {

	public readonly id: BountyId;
	public readonly authorId: string;
	public readonly authorName: string;
	public readonly message: string;
	public readonly timestamp: number;
	public readonly reward: Reward;

	constructor(request: BountyRequest<Reward>) {
		this.id = request.id!;
		this.authorId = request.authorId;
		this.authorName = request.authorName;
		this.message = request.bounty;
		this.reward = request.reward;
		this.timestamp = request.timestamp ?? Date.now();
	}


}
