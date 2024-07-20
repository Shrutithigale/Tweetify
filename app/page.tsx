"use client";
import React, { use, useCallback } from "react";
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
import { graphQLClient } from "@/Clients/api";
import { verifyUserGoogleTokenQuery } from "@/graphql/Queries/user";



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

  const handleLoginWithGoogle = useCallback(async (cred:CredentialResponse) => {
  
    // Handle the login response, e.g., save tokens, user info, etc.
    const googleToken = cred.credential;
    if(!googleToken) return toast.error(`Google token not found`)

    const {verifyGoogleToken} =await graphQLClient.request(
      verifyUserGoogleTokenQuery,
      {token: googleToken})



      toast.success("verified success")
      console.log(verifyGoogleToken)

      if(verifyGoogleToken) 
        window.localStorage.setItem("_twitter_token", verifyGoogleToken)
    },
  []
);
  




  return (
   <div className={inter.className}>
    <div className="grid grid-cols-12 h-screen w-screen px-28">
    <div className="col-span-3 pt-1 border ml-28 ">
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
    </div>
    <div className="col-span-5 border-r-[1px] border-l-[1px] border-gray-600 ">
      <FeedCard/>
      <FeedCard/>
      <FeedCard/>
      <FeedCard/>
      <FeedCard/>
      <FeedCard/>
      <FeedCard/>
      <FeedCard/>
      <FeedCard/>
      <FeedCard/>
      <FeedCard/>
      <FeedCard/>
      <FeedCard/>
      <FeedCard/>
      <FeedCard/>
      <FeedCard/>
    </div>
    <div className="col-span-3 p-5">
      <div className=" p-5 bg-slate-700 rounded-lg">
        <h1 className="my-2 text-2xl">New to Tweetify??</h1>
    <GoogleLoginButton onSuccess={handleLoginWithGoogle} />
    </div>

    </div>
    </div>
  </div>

  );
}
