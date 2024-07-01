import { Client, Account, ID, Avatars, Databases, Query, Storage } from 'react-native-appwrite';

export const config = {
                                endpoint: 'https://cloud.appwrite.io/v1', 
                                platform: 'com.jsm.aora_test',
                                projectId: '6657454c00280be2ed2c',
                                databaseId: '6657472b001bc9c6e19b',
                                userCollectionId: '665748560038f4bc1a03',
                                videoCollectionId: '6657487a0037761851dc',
                                storageId: '66574a23003d7735c711',
                                apiKey: '31c74a7db13c6482e68a857ec97bf3f1b832b0c29385808a573aadc466c0ee67893f8b4e33d03880c9cacf45d7c30b6aa69ef7701e8a99b448905399512687d006f71654c438e97d5dab4a861f7723005fd2f5b84f182135895fdd9215478570455740499de3f2458b390c37c3194e816f4d6804de0ab7770e8cd86383f66228'
                                
                              }

const client = new Client();
client
  .setEndpoint(config.endpoint)
  .setProject(config.projectId)
  .setPlatform(config.platform);

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);
const storage = new Storage(client);



export const createUser =  async (email, password, username) => {

  try {
    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      username

    )
    console.log('New account created:', newAccount);
    if(!newAccount) throw Error;

    const avatarUrl = avatars.getInitials(username)

    await signIn(email, password);

    const newUser = await databases.createDocument(
      config.databaseId,
      config.userCollectionId,
      ID.unique(),
      {accountId: newAccount.$id,email,username,avatar: avatarUrl}
    )
    console.log('New user document created:', newUser);
    return newUser;

  } catch (error) {
    console.log(error);
    throw new Error(error);
  }

}


export async function signIn(email, password) {
  try {
    // // Check if a session already exists
    // // console.log('Listing sessions...');

    // const sessions = await account.listSessions();
    // console.log('Sessions:', sessions);
    // if (sessions.total > 0) {
    //   // Delete existing sessions
    //   await Promise.all(sessions.sessions.map(session => account.deleteSession(session.$id)));
    // }
    const session = await account.createEmailPasswordSession(email, password);

    return session;
  } catch (error) {
    throw new Error(error);
  }
}
// Get Account
export async function getAccount() {
  try {
    const currentAccount = await account.get();

    return currentAccount;
  } catch (error) {
    throw new Error(error);
  }
}

// Get Current User
export async function getCurrentUser() {
  try {
    const currentAccount = await getAccount();
    if (!currentAccount) throw Error;

    const currentUser = await databases.listDocuments(
      config.databaseId,
      config.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );

    if (!currentUser) throw Error;

    return currentUser.documents[0];
  } catch (error) {
    console.log(error);
    return null;
  }
}

export const getAllPosts = async () => {
  try {
    const posts = await databases.listDocuments(
      config.databaseId,
      config.videoCollectionId,
      [Query.orderDesc("$createdAt")] /*## returns an empty array for Latestposts for some reason must return to fix for now moving on*/

    )

    return posts.documents
  } catch (error) {
    throw new Error(error)
  }
}

export const getLatestPosts = async () => {
  try {
    const posts = await databases.listDocuments(
      config.databaseId,
      config.videoCollectionId,
      [Query.orderDesc("$createdAt", Query.limit(7))] /*## returns an empty array for Latestposts for some reason must return to fix for now moving on*/
      
    )

    return posts.documents
  } catch (error) {
    throw new Error(error)
  }
}

export const searchPosts = async (query) => {
  try {
    const posts = await databases.listDocuments(
      config.databaseId,
      config.videoCollectionId,
      [Query.search('title',query)]
      // [Query.orderDesc("$createdAt", Query.limit(7))] ## returns an empty array for Latestposts for some reason must return to fix for now moving on
      
    )

    return posts.documents
  } catch (error) {
    throw new Error(error)
  }
}

export const getUserPosts = async (userId) => {
  try {
    const posts = await databases.listDocuments(
      config.databaseId,
      config.videoCollectionId,
      [Query.equal('creator',userId),Query.orderDesc("$createdAt")]
      // [Query.orderDesc("$createdAt"), Query.limit(7))] ## returns an empty array for Latestposts for some reason must return to fix for now moving on
      
    )

    return posts.documents
  } catch (error) {
    throw new Error(error)
  }
}

export const savePost = async (id,userId,bookmark) => {
  try {
   
    const result = await databases.updateDocument(
      config.databaseId,
      config.videoCollectionId,
      id, // documentId
      {bookmark: [...bookmark,userId]}, // data (optional)
    );
    console.log('Video saved',result);
  } catch (error) {
    console.log(error)
  }
  
}

export const unSavePost = async (id,userId,bookmark) => {
  const editBookmark = bookmark.filter((item) => item.$id !== userId)

    try {
      const result = await databases.updateDocument(
        config.databaseId,
        config.videoCollectionId,
        id, // documentId
        {bookmark: editBookmark}

      );
      console.log('Video unSved:',result);
    } catch (error) {
      console.log(error)
    } 

  
}

export const getSavedPosts = async (userId, query) => {
  try {
    const queryArray = query ? [Query.search('title', query)] : [];
    
    const posts = await databases.listDocuments(
      config.databaseId,
      config.videoCollectionId,
      queryArray
    );

    const filteredPosts = posts.documents.filter(pos => pos.bookmark.some(item => item.$id === userId));
    return filteredPosts;

  } catch (error) {
    throw new Error(error);
  }
};


export const signOut = async () => {
  try {
    const session = await account.deleteSession("current");

    return session;
  } catch (error) {
    throw new Error(error)
    
  }
}

export const getFilePreview = async (fileId, type) => {
  try {
    if (type === 'video') {
      fileUrl = storage.getFileView(config.storageId,fileId)
    } else if(type === 'image') {
      fileUrl = storage.getFilePreview(config.storageId,fileId, 2000, 2000, 'top', 100)

    } else {
      throw new Error('Invalid file type')
    }

    if (!fileUrl) throw Error;

    return fileUrl
  } catch (error) {
    throw new Error(error)

  }
}
export const uploadFile = async (file, type) => {
  if(!file) return;

  const {mimeType,...rest} = file;

  const asset = {
    name: file.fileName,
    type: file.mimeType,
    size: file.fileSize,
    uri: file.uri
  }

  try {
    const uploadedFile = await storage.createFile(
      config.storageId,
      ID.unique(),
      asset

    );

    const fileUrl = await getFilePreview(uploadedFile.$id, type)

    return fileUrl
  } catch (error) {
    throw new Error(error)

  }
}

export const createVideo = async (form) => {
  try {
    const [thumbnailUrl, videoUrl] = await Promise.all([
      uploadFile(form.thumbnail,'image'),
      uploadFile(form.video,'video')

    ])

    const newPost = await databases.createDocument(
      config.databaseId, config.videoCollectionId, ID.unique(), {
        title: form.title,
        thumbnail: thumbnailUrl,
        video: videoUrl,
        prompt: form.prompt,
        creator: form.userId
      }
    )

    return newPost;
  } catch (error) {
    throw new Error(error)
  }
}