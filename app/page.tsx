"use client";
import React, { use, useCallback, useState } from "react";
import Image from "next/image";
import { Inter } from "next/font/google";
import { BsTwitter} from "react-icons/bs";
import { BiHomeCircle } from "react-icons/bi";
import { BiHash } from "react-icons/bi";
import { BiBell } from "react-icons/bi";
import { BsEnvelope } from "react-icons/bs";
import { BsBookmark } from "react-icons/bs";
import { BiUser } from "react-icons/bi";
import FeedCard from "@/components/FeedCard";
import { PiMoneyFill } from "react-icons/pi";
import { SlOptions } from "react-icons/sl";
import GoogleLoginButton from "@/components/loginbutton/googlelogin";
import toast from "react-hot-toast";
import { CredentialResponse } from "@react-oauth/google";
import { graphQLClient, queryClient } from "@/Clients/api";
import { verifyUserGoogleTokenQuery } from "@/graphql/query/user";
import { useCurrentUser } from "@/Hooks/user";
import { useQueryClient } from "@tanstack/react-query";
import { InvalidateQueryFilters } from "@tanstack/react-query";
import { BiImageAlt } from "react-icons/bi";
import { useCreateTweet, useGetAllTweets } from "@/Hooks/Tweet";
import { Tweet } from "@/gql/graphql";




const inter = Inter( {subsets:["latin"]});

interface TwitterSidebarButton {
  title:string;
  icon: React.ReactNode;
}


const sidebarMenuItems: TwitterSidebarButton[] = [
  {
    title:"Home",
    icon: <BiHomeCircle/>
  },
  {
    title:"Explore",
    icon: <BiHash/>
  },
  {
    title:"Notification",
    icon: <BiBell/>
  },
  {
    title:"Messages",
    icon: <BsEnvelope/>
  },
  {
    title:"Bookmarks",
    icon: <BsBookmark/>
  },
  {
    title:"Twitter Blue",
    icon:<PiMoneyFill/>
  },
  {
    title:"Profile",
    icon: <BiUser/>
  },
  {
    title:"More Options",
    icon:<SlOptions/>
  },



]


export default function Home() {

  const {user} = useCurrentUser()
  const {tweets = []} = useGetAllTweets()
  const {mutate} = useCreateTweet()


  const queryClient = useQueryClient()

  const [content , setContent] = useState("")


  const handleSelectImage = useCallback(() => {
    const input = document.createElement("input")
    input.setAttribute("type","file")
    input.setAttribute("accept","image/*")
    input.click()

  },[])


  const handleCreateTweet = useCallback(() => {
    mutate({
      content,
    })

  },[ content,mutate])


  const handleLoginWithGoogle = useCallback(async (cred:CredentialResponse) => {
  
    // Handle the login response, e.g., save tokens, user info, etc.
    const googleToken = cred.credential;
    if(!googleToken) return toast.error(`Google token not found`)

    const {verifyGoogleToken} = await graphQLClient.request(
      verifyUserGoogleTokenQuery,
      {token: googleToken})



      toast.success("verified success")
      console.log(verifyGoogleToken);

      if(verifyGoogleToken) {
        window.localStorage.setItem("_twitter_token", verifyGoogleToken);
        await queryClient.invalidateQueries({ queryKey: ['current-user'] });

      }
    },

  [queryClient]
);
  




  return (
   <div className={inter.className}>
    <div className="grid grid-cols-12 h-screen w-screen px-56">
    <div className="col-span-4 pt-1 border ml-28 relative">
      <div className="text-2xl h-fit w-fit hover:bg-gray-800 rounded-full p-4 cursor-pointer transition-all">
      <BsTwitter />
      </div>
      <div className="mt-1 text-1xl pr-4">
        <ul>
        {sidebarMenuItems.map((item) =>(
          <li className="flex justify-start items-center gap-4 hover:bg-gray-800 rounded-full px-3 py-3 w-fit cursor-pointer mt-0"
           key={item.title}>
            <span className="text-3xl">{item.icon}</span>
            <span>{item.title}</span>
        </li>
      ))}

        </ul>
        <div className="mt-5 px-3">
        <button className="bg-sky-400 font-semibold text-lg py-2 px-4 rounded-full w-full ">
          Tweet
          </button>
          </div>
      </div>
      {user && <div className=" mt-10 bottom-1 flex gap-2 items-center bg-slate-800 p-3 px-3 py-2 rounded-full">
        {user && user.profileImageURL && 
       ( <Image 
        className="rounded-full"
        src={user?.profileImageURL} 
        alt="user-Image" 
        height={50}
         width={50}/>)}
         <div>
         <h3 className="text-nowrap">
          {user.firstName} {user.lastName}
          </h3>
        
         </div>
      </div>
      }
    </div>
    <div className="col-span-5 border-r-[1px] border-l-[1px] border-gray-600 ">
      <div>
        <div className="border border-r-0 border-l-0 border-b-0 border-gray-600 p-5 hover:bg-slate-900 transition-all cursor-pointer">
          <div className="grid grid-cols-12 gap-3">
          <div className="col-span-1">
               {user?.profileImageURL && (
                <Image 
                className="rounded-full"
                src={user?.profileImageURL}
               alt="user-image" 
               height={50} 
               width={50} />
               ) }
               </div>
               <div className="col-span-11">
                <textarea
                value={content}
                onChange={e => setContent(e.target.value)}
                className=" w-full bg-transparent text-xl px-3 border-b border-slate-700" 
                placeholder="What's happening?"
                rows={3}>
                </textarea>
                <div className="mt-2 flex justify-between items-center">
                  <BiImageAlt onClick={handleSelectImage} className="text-xl"/>
                  <button 
                  onClick={handleCreateTweet}
                  className="bg-sky-400 font-semibold text-sm py-2 px-4 rounded-full  ">
                   Tweet
                  </button>
                </div>
               </div>
          </div>
        </div>
      </div>
    {
      tweets?.map(tweet => 
      tweet ? <FeedCard key={tweet?.id} data={tweet as Tweet}/> : null
    )
    }
     
    </div>
    <div className="col-span-3 p-5">
      {!user && <div className=" p-5 bg-slate-700 rounded-lg">
        <h1 className="my-2 text-2xl">New to Tweetify??</h1>
    <GoogleLoginButton onSuccess={handleLoginWithGoogle} />
    </div>}

    </div>
    </div>
  </div>

  );
}
