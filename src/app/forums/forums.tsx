import React from 'react';
import './forums.css';
import Forum from "./components/Sidebar.tsx"


interface ForumProps {
  name: string;
  participants: string[]; // Array of participant IDs
  moderators: string[]; // Array of moderator IDs
  threads: Array<{
    title: string;
    creator: string;
    participants: string[];
    posts: Array<{
      content: string;
      creator: string;
      replies: Array<{
        content: string;
        creator: string;
      }>;
    }>;
  }>;
}

const Forum: React.FC<ForumProps> = ({ name, participants, moderators, threads }) => {
  return (
    <div className="forum-container">
      <h1 className="forum-title">{name}</h1>

      <section className="forum-section">
        <h2>Participants</h2>
        <ul className="forum-list">
          {participants.map((participant) => (
            <li key={participant}>{participant}</li>
          ))}
        </ul>
      </section>

      <section className="forum-section">
        <h2>Moderators</h2>
        <ul className="forum-list">
          {moderators.map((moderator) => (
            <li key={moderator}>{moderator}</li>
          ))}
        </ul>
      </section>

      <section className="forum-section">
        <h2>Threads</h2>
        {threads.map((thread, index) => (
          <div key={index} className="forum-thread">
            <h3>{thread.title}</h3>
            <p>Created by: {thread.creator}</p>
            <p>Participants: {thread.participants.join(', ')}</p>
            <div className="forum-posts">
              {thread.posts.map((post, postIndex) => (
                <div key={postIndex} className="forum-post">
                  <p>{post.content}</p>
                  <p>By: {post.creator}</p>
                  <div className="forum-replies">
                    {post.replies.map((reply, replyIndex) => (
                      <div key={replyIndex} className="forum-reply">
                        <p>{reply.content}</p>
                        <p>By: {reply.creator}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};

export default Forum;
