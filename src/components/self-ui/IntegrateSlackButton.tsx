'use client'
import Link from 'next/link';
import React from 'react';

const IntegrateSlackButton = () => {
  const slack_client_id=process.env.NEXT_PUBLIC_SLACK_CLIENT_ID;
  const slack_ngrok_url=process.env.NEXT_PUBLIC_NGROK_URL;
    return (
      <div  className="text-foreground flex flex-1 justify-end pr-6">
      <Link href={`https://slack.com/oauth/v2/authorize?client_id=${slack_client_id}&scope=chat:write,channels:read,channels:join,calls:read,chat:write.public,mpim:read,im:write,groups:read&redirect_uri=${ slack_ngrok_url}/api/slack/callback`}>
        <img
          alt="Add to Slack"
          height="40"
          width="139"
          src="https://platform.slack-edge.com/img/add_to_slack.png"
          srcSet="https://platform.slack-edge.com/img/add_to_slack.png 1x, https://platform.slack-edge.com/img/add_to_slack@2x.png 2x"
        />
      </Link>
      </div>
    );
  };
  
  export default IntegrateSlackButton;
  