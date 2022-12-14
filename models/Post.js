import mongoose from "mongoose";

const PostSchema = mongoose.Schema(
	{
		title: {
			type: String,
			required: true
		},
		text: {
			type: String,
			required: true,
			unique: true
		},
		imageUrl: String,
		tags: {
			type: Array,
			default: []
		},
		viewsCount: {
			type: Number,
			default: 0
		},
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		userUrl: String
	},
	{
		timestamps: true
	}
)

export default mongoose.model('Post', PostSchema)