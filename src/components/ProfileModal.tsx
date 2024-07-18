"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import Image from "next/image";

export interface TeamMember {
  name: string;
  title: string;
  bio: string;
  twitter: string;
  linkedin: string;
  imgSrc: string;
}

export interface ProfileModalProps {
  trigger: React.ReactNode;
  teamMember: TeamMember;
}

export function ProfileModal({ trigger, teamMember }: ProfileModalProps) {
  const [name, setName] = useState(teamMember.name || "");
  const [twitterHandle, setTwitterHandle] = useState(teamMember.twitter || "");
  const [title, setTitle] = useState(teamMember.title || "");
  const [linkedinUrl, setLinkedinUrl] = useState(teamMember.linkedin || "");
  const [bio, setBio] = useState(teamMember.bio || "");
  const [imgSrc, setImgSrc] = useState(teamMember.imgSrc || "");

  const handleUpdateProfile = async () => {
    const updatedProfile = {
      name,
      twitterHandle,
      title,
      linkedinUrl,
      bio,
    };

    try {
      const response = await fetch(
        "https://mock-api-endpoint.com/updateProfile",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedProfile),
        }
      );

      if (response.ok) {
        alert("Profile updated successfully!");
      } else {
        alert("Failed to update profile.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("An error occurred while updating the profile.");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImgError(false);
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (upload) => {
        setImgSrc(upload.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const openFileInput = () => {
    const fileInput = document.getElementById("file-input");
    if (fileInput) {
      fileInput.click();
    }
  };
  const [imgError, setImgError] = useState(false);
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className='sm:max-w-[625px]'>
        <div className='flex flex-col items-center space-y-4'>
          <div className='relative'>
            <Button
              className='bg-transparent hover:bg-transparent w-42 rounded-full h-32'
              onClick={openFileInput}
            >
              <div className='w-32 h-32 bg-blue-100 rounded-full flex items-center justify-center border-2 border-dashed border-blue-300'>
                <Input
                  type='file'
                  id='file-input'
                  className='hidden'
                  onChange={handleFileChange}
                />
                {imgSrc && !imgError ? (
                  <Image
                    src={imgSrc}
                    alt='Profile'
                    width={128}
                    height={128}
                    onError={() => setImgError(true)}
                    className='w-32 h-32 rounded-full'
                  />
                ) : (
                  <CameraIcon className='w-8 h-8 text-blue-500' />
                )}
              </div>
            </Button>
          </div>
          <div className='grid w-full gap-4 md:grid-cols-2'>
            <div className='flex items-center space-x-2'>
              <Input
                className='bg-[#F9FAFB] bg-user-icon icon-input bg-left bg-no-repeat pl-8 h-full placeholder:text-gray-500 text-base placeholder:font-normal rounded-r-none focus:outline-none font-body placeholder:leading-normal'
                placeholder='Name'
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className='flex items-center space-x-2'>
              <Input
                className='bg-[#F9FAFB] bg-twitter-icon icon-input bg-left bg-no-repeat pl-8 h-full placeholder:text-gray-500 text-base placeholder:font-normal rounded-r-none focus:outline-none font-body placeholder:leading-normal'
                placeholder='Twitter handle'
                value={twitterHandle}
                onChange={(e) => setTwitterHandle(e.target.value)}
              />
            </div>
            <div className='flex items-center space-x-2'>
              <Input
                className='bg-[#F9FAFB] bg-location-icon icon-input bg-left bg-no-repeat pl-8 h-full placeholder:text-gray-500 text-base placeholder:font-normal rounded-r-none focus:outline-none font-body placeholder:leading-normal'
                placeholder='Title'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className='flex items-center space-x-2'>
              <Input
                className='bg-[#F9FAFB] bg-linkedin-icon icon-input bg-left bg-no-repeat pl-8 h-full placeholder:text-gray-500 text-base placeholder:font-normal rounded-r-none focus:outline-none font-body placeholder:leading-normal'
                placeholder='LinkedIn URL'
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
              />
            </div>
          </div>
          <Textarea
            placeholder='Bio'
            className='w-full min-h-[100px] '
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
          <Button
            className='w-full bg-blue-600 text-white'
            onClick={handleUpdateProfile}
          >
            Update profile
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function CameraIcon({ ...props }) {
  return (
    <svg
      {...props}
      xmlns='http://www.w3.org/2000/svg'
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <path d='M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z' />
      <circle cx='12' cy='13' r='3' />
    </svg>
  );
}
