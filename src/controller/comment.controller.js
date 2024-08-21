import User from '##/src/models/user.model.js';
import Comment from '##/src/models/comment.model.js';
import Video from '##/src/models/video.model.js';
import Filter from 'bad-words';
const filter = new Filter();
async function createComment(req, res) {
  try {
    const { videoId, userId, comment } = req.body;

    if (!videoId || !userId || !comment) {
      return res.status(400).json({ message: 'Video ID, User ID, and Comment are required' });
    }

    const cleanComment = filter.clean(comment);

    const newComment = new Comment({ videoId, userId, comment: cleanComment });
    await newComment.save();

    return res.status(201).json({ message: 'Comment created successfully', comment: newComment });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}

async function getAllComments(req, res) {
  try {
    const { videoId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10; // Comments per page

    if (!videoId) {
      return res.status(400).json({ message: 'Video ID is required' });
    }

    const skip = (page - 1) * limit;

    const [comments, totalComments] = await Promise.all([
      Comment.find({ videoId })
        .populate('userId', 'firstName lastName')
        .sort({ createdAt: -1 }) // Sort by date (latest first)
        .skip(skip)
        .limit(limit)
        .lean(),
      Comment.countDocuments({ videoId }),
    ]);

    if (!comments || comments.length === 0) {
      return res.status(404).json({ message: 'No comments found for this video' });
    }

    return res.status(200).json({
      message: 'Comments fetched successfully',
      comments,
      totalComments,
      currentPage: page,
      totalPages: Math.ceil(totalComments / limit),
    });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}

async function deleteComment(req, res) {
  try {
    const { commentId } = req.params;

    if (!commentId) {
      return res.status(400).json({ message: 'Comment ID is required' });
    }

    const deletedComment = await Comment.findByIdAndDelete(commentId);

    if (!deletedComment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    return res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}

// Update a comment
async function updateComment(req, res) {
  try {
    const { commentId } = req.params;
    const { comment } = req.body;

    if (!commentId || !comment) {
      return res.status(400).json({ message: 'Comment ID and updated comment are required' });
    }

    const cleanComment = filter.clean(comment);

    const updatedComment = await Comment.findByIdAndUpdate(
      commentId,
      { comment: cleanComment },
      { new: true },
    );

    if (!updatedComment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    return res
      .status(200)
      .json({ message: 'Comment updated successfully', comment: updatedComment });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}

export { createComment };
