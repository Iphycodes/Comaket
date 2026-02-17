import { Button } from 'antd';
import React from 'react';

interface CommentBoxProps {}

const CommentBox = ({}: CommentBoxProps) => {
  return (
    <div className="mt-auto relative flex gap-1 items-center bg-neutral-100">
      <textarea
        placeholder="Add a comment..."
        rows={2}
        className="w-full px-3 !py-2 !outline-none focus:!outline-none border-gray-300 focus:!border-none dark:border-gray-700 dark:focus:border-blue bg-transparent transition-colors resize-none"
        onChange={(e) => {
          const hasContent = e.target.value.trim().length > 0;
          // You can use state to control the button visibility
          // This is a simple inline approach
          const postButton = document.getElementById('post-comment-button');
          if (postButton) {
            postButton.style.display = hasContent ? 'block' : 'none';
          }
        }}
      />
      <Button
        type="link"
        id="post-comment-button"
        className="text-[10px] underline text-blue font-medium hidden hover:bg-blue transition-colors"
      >
        Post
      </Button>
    </div>
  );
};

export default CommentBox;
