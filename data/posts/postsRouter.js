const express = require("express");
const Posts = require("../db");
const router = express.Router();

//Server.Get posts
router.get("/", (req, res) => {
  Posts.find()
    .then(posts => {
      res.status(200).json({
        success: true,
        posts
      });
    })
    .catch(err => {
      res.status(500).json({
        success: false,
        message: "The posts information could not be retrieved",
        err
      });
    });
});

//Server.Get post:id and comments,  Combined to make code cleaner
router.get("/:id/comments", async (req, res) => {
  const post_id = req.params.id;

  const post = await Posts.findById(post_id);

  if (post.length === 0) {
    res.status(404).json({
      success: false,
      errorMessage: "The post with the specificed ID does not exist."
    });
  } else {
    Posts.findPostComments(post_id)
      .then(comments => {
        res.status(200).json({
          success: true,
          comments
        });
      })
      .catch(err => {
        res.status(500).json({
          success: false,
          errorMessage: "The comments information could not be retrieved",
          err
        });
      });
  }
});

//Server.post
router.post("/", (req, res) => {
  const post = req.body;

  if (!post.title || !post.contents) {
    const missingField =
      !post.title && !post.contents
        ? "a title and contents"
        : !post.title
        ? "a title"
        : "contents";

    res.status(400).json({
      success: false,
      errorMessage: `Please provide ${missingField} for the post.`
    });
  } else {
    Posts.insert(post)
      .then(post => {
        res.status(201).json({
          success: true,
          post
        });
      })
      .catch(err => {
        res.status(500).json({
          success: false,
          errorMessage:
            "There was an error while save the post to the database",
          err
        });
      });
  }
});

//Server.post id: comments
router.post("/:id/comments", async (req, res) => {
  const text = req.body.text;
  const post_id = req.params.id;
  console.log(text);

  const post = await Posts.findById(post_id);

  if (post.length === 0) {
    res.status(404).json({
      success: false,
      errorMessage: "The post with the specificed ID does not exist."
    });
  } else if (!text) {
    res.status(400).json({
      success: false,
      erroMessage: "Please provide text for the comment."
    });
  } else {
    Posts.insertComment({
      text,
      post_id
    })
      .then(comment => {
        res.status(201).json({
          success: true,
          comment
        });
      })
      .catch(err => {
        res.status(500).json({
          errorMessage:
            "There was an error while saving the comment to the database",
          err
        });
      });
  }
});

//Server.post comments and id, combined to make code cleaner
router.post("/:id/comments", async (req, res) => {
  const text = req.body.text;
  const post_id = req.params.id;
  console.log(text);

  const post = await Posts.findById(post_id);

  if (post.length === 0) {
    res.status(404).json({
      success: false,
      errorMessage: "The post with the specificed ID does not exist."
    });
  } else if (!text) {
    res.status(400).json({
      success: false,
      erroMessage: "Please provide text for the comment."
    });
  } else {
    Posts.insertComment({
      text,
      post_id
    })
      .then(comment => {
        res.status(201).json({
          success: true,
          comment
        });
      })
      .catch(err => {
        res.status(500).json({
          errorMessage:
            "There was an error while saving the comment to the database",
          err
        });
      });
  }
});

//Server.delete posts
router.delete("/:id", async (req, res) => {
  const post_id = req.params.id;

  const post = await Posts.findById(post_id);

  if (post.length === 0) {
    res.status(404).json({
      success: false,
      errorMessage: "The post with the specificed ID does not exist."
    });
  } else {
    Posts.remove(post_id)
      .then(post => {
        res.status(200).json({
          success: true,
          post
        });
      })
      .catch(err => {
        res.status(500).json({
          success: false,
          errorMessage: "The post could not be removed",
          err
        });
      });
  }
});

//Server.delete posts
router.delete("/:id", async (req, res) => {
  const post_id = req.params.id;

  const post = await Posts.findById(post_id);

  if (post.length === 0) {
    res.status(404).json({
      success: false,
      errorMessage: "The post with the specificed ID does not exist."
    });
  } else {
    Posts.remove(post_id)
      .then(post => {
        res.status(200).json({
          success: true,
          post
        });
      })
      .catch(err => {
        res.status(500).json({
          success: false,
          errorMessage: "The post could not be removed",
          err
        });
      });
  }
});

//server.put
router.put("/:id", async (req, res) => {
  const post_id = req.params.id;
  const updatedPost = req.body;

  let existingPost = await Posts.findById(post_id);

  if (existingPost.length === 0) {
    res.status(404).json({
      success: false,
      errorMessage: "The post with the specificed ID does not exist."
    });
  }

  if (!updatedPost.title || !updatedPost.contents) {
    const missingField =
      !updatedPost.title && !updatedPost.contents
        ? "a title and contents"
        : !updatedPost.title
        ? "a title"
        : "contents";

    res.status(400).json({
      success: false,
      errorMessage: `Please provide ${missingField} for the post.`
    });
  } else {
    Posts.update(post_id, updatedPost)
      .then(post => {
        res.status(200).json({
          success: true,
          post
        });
      })
      .catch(err => {
        res.status(500).json({
          success: false,
          errorMessage: "The post could not be removed",
          err
        });
      });
  }
});
module.exports = router;
