import axios from "axios";

const CreateSendBirdUser = (userId, nickName, profileUrl) => {
  const SendBirdApplicationId = process.env.NEXT_PUBLIC_SENDBIRD_APP_ID;
  const SendBirdApiToken = process.env.NEXT_PUBLIC_SENDBIRD_API_TOKEN;

  // Log nilai Application ID dan API Token untuk memastikan nilainya benar
  console.log("Application ID:", SendBirdApplicationId);
  console.log("API Token:", SendBirdApiToken);

  // Log data yang akan dikirim untuk memastikan datanya benar
  console.log("Data sent to SendBird:", {
    user_id: userId,
    nickname: nickName,
    profile_url: profileUrl,
    issue_access_token: false,
  });

  return axios.post(
    `https://api-${SendBirdApplicationId}.sendbird.com/v3/users`,
    {
      user_id: userId,
      nickname: nickName,
      profile_url: profileUrl,
      issue_access_token: false,
    },
    {
      headers: {
        "Content-Type": "application/json",
        "Api-Token": SendBirdApiToken,
      },
    }
  );
};

const CreateSendBirdChannel = (users, title) => {
  const SendBirdApplicationId = process.env.NEXT_PUBLIC_SENDBIRD_APP_ID;
  const SendBirdApiToken = process.env.NEXT_PUBLIC_SENDBIRD_API_TOKEN;

  return axios.post(
    `https://api-${SendBirdApplicationId}.sendbird.com/v3/group_channels`,
    {
      user_ids: users,
      is_distinct: true,
      name: title,
    },
    {
      headers: {
        "Content-Type": "application/json",
        "Api-Token": SendBirdApiToken,
      },
    }
  );
};

// Export kedua fungsi
export { CreateSendBirdUser, CreateSendBirdChannel };
