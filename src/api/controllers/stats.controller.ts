import type { Request, Response } from "express";
import { client as botClient } from "../../index"

export const getStats = (req: Request, res: Response) => {

	if (botClient.isReady()) {

		return res.json({
			message: 'Request received',
		})
	} else {
		return res.json({
			message: "Cannot retrieve information about Fuyumi at this time because the client is not ready."
		})
	}
}