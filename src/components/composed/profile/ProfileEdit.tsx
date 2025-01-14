"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usePrivy } from "@privy-io/react-auth";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ProfileConnections } from "../profile/ProfileConnections";
import { Textarea } from "@/components/ui/textarea";
import { LoaderIcon, TrashIcon } from "lucide-react";
import { fetchUserProfile } from "@/lib/api/helpers";
import { usePathname, useRouter } from "next/navigation";
import { JobTypeSelect } from "../inputs/JobTypeSelect";
import { JobSelect } from "../inputs/JobSelect";
import { SelectComposed } from "../inputs/SelectComposed";

interface Props {
  isEditMode?: boolean;
  onSubmit: (formDetails: {
    name: string;
    email: string;
    bio: string;
    bestProfile: string;
    calendar: string;
    fee: string;
    bookingDescription: string;
    isAvailable: boolean;
    geography: string;
    position: string[];
    employmentType: string[];
    tempPhotoUrl: string | null;
  }) => void;
  onClose?: () => void;
}

export const ProfileEditForm = ({ isEditMode, onSubmit, onClose }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [tempPhotoUrl, setTempPhotoUrl] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    bio: "",
    bestProfile: "",
    calendar: "",
    fee: "",
    bookingDescription: "",
    geography: "",
    isAvailable: true,
    position: [""],
    employmentType: [""],
  });

  const [isProfileComplete, setIsProfileComplete] = useState<boolean>(false);
  const [addPosition, setAddPosition] = useState<boolean>(false);
  const [addEmploymentType, setAddEmploymentType] = useState<boolean>(false);

  const { user, getAccessToken } = usePrivy();
  const router = useRouter();
  const pathname = usePathname();

  const { data: userProfileData } = useQuery({
    enabled: !!user,
    queryKey: ["user", user?.id?.replace("did:privy:", "")],
    queryFn: async () => {
      const accessToken = await getAccessToken();
      return await fetchUserProfile({ userId: user?.id, accessToken });
    },
  });

  console.log("🚀 ~ ProfileEditForm ~ userProfileData:", userProfileData);
  const { data: jobSalaryOptions, isLoading: jobSalaryOptionsLoading } =
    useQuery({
      queryKey: ["job-salary-options"],
      queryFn: async () => {
        const res = await fetch(`/api/salary-range/details`, {
          method: "GET",
          cache: "no-store",
          headers: {
            "Content-type": "application/json",
          },
        });
        return (await res.json()) as {
          success: boolean;
          salaryDetails: {
            roleTitles: string[];

            locations: string[];
          };
        };
      },
    });

  useEffect(() => {
    // check if the url contains any query params and set the form state accordingly
    const urlSearchParams = new URLSearchParams(window.location.search);
    const urlParams = Object.fromEntries(urlSearchParams.entries());
    const isFormComplete = form.name && form.bio && form.email;

    if (
      Object.keys(urlParams).filter(
        (val) => val !== "settingsMode" && val !== "editMode"
      ).length
    ) {
      setForm({
        name: urlParams.name ?? "",
        email: urlParams.email ?? "",
        bio: urlParams.bio ?? "",
        bestProfile: urlParams.bestProfile ?? "",
        calendar: urlParams.calendar ?? "",
        fee: urlParams.fee ?? "",
        bookingDescription: urlParams.bookingDescription ?? "",
        isAvailable: urlParams.isAvailable === "true",
        position: urlParams.position ? urlParams.position.split(",") : [""],
        employmentType: urlParams.employmentType
          ? urlParams.employmentType.split(",")
          : [""],
        geography: urlParams.geography ?? "",
      });
    } else if (userProfileData?.success) {
      setForm({
        name: user?.google?.name ?? "",
        email: user?.google?.email ?? "",
        bio: userProfileData.profile?.bio ?? "",
        bestProfile: userProfileData.profile?.preferred_profile ?? "",
        calendar: userProfileData.profile?.calendly_link ?? "",
        fee: userProfileData.profile?.unlock_calendar_fee ?? "",
        bookingDescription: userProfileData.profile?.booking_description ?? "",
        isAvailable: userProfileData.profile?.available ?? true,
        position: userProfileData.profile?.position ?? [""],
        employmentType: userProfileData.profile?.employment_type ?? [""],
        geography: userProfileData.profile?.geography ?? "",
      });
    }
  }, [userProfileData]);

  useEffect(() => {
    const isFormComplete = form.name && form.bio && form.email;
    setIsProfileComplete(!isFormComplete);
  }, [form.name, form.bio, form.email]);

  const handleSelectPhoto = async (photoUrl: string) => {
    setTempPhotoUrl(photoUrl);
  };

  const handleButtonClick = (button: boolean) => {
    setForm({ ...form, isAvailable: button });
  };

  return (
    <>
      <div className='flex flex-col items-center gap-0 mb-0'>
        <Avatar className='w-24 h-24 border-blue-700 border-2'>
          <AvatarImage
            src={tempPhotoUrl ?? userProfileData?.profile?.photo_source ?? ""}
          />
          <AvatarFallback>
            {userProfileData?.profile?.name?.slice(0, 2) ??
              user?.google?.name?.slice(0, 2)}
          </AvatarFallback>
        </Avatar>

        {/* <Dialog>
          <DialogTrigger asChild>
            <Button variant='link' className='text-blue-700 focus:border-0'>
              Change photo
            </Button>
          </DialogTrigger>
          <DialogContent className='sm:max-w-[425px] bg-[#e1effe] font-body m-auto py-8'>
            <DialogHeader className='flex flex-col gap-5'>
              <DialogTitle className='text-2xl font-bold font-heading  mt-8'>
                Select a photo from your linked accounts
              </DialogTitle>

              <div className='flex flex-1 gap-2'>
                {user?.linkedAccounts?.map(
                  (linkedAccount: any, idx: number) => {
                    const image =
                      linkedAccount.profilePictureUrl ?? linkedAccount.pfp;
                    if (!image) return;
                    return (
                      <div className='flex flex-col gap-2' key={idx}>
                        <Image
                          width={10}
                          height={10}
                          className='w-10 h-10 m-auto rounded-full justify-center items-center'
                          src={image ?? ""}
                          alt={linkedAccount.username}
                        />
                        <Button
                          key={linkedAccount}
                          className='w-full bg-[#2640eb]'
                          onClick={() => handleSelectPhoto(image)}
                        >
                          {linkedAccount.type.replace("_oauth", "")}
                        </Button>
                      </div>
                    );
                  }
                )}
              </div>
              <span className='text-sm font-light font-body'>
                connect more accounts to see more options
              </span>
              <ProfileConnections
                setTempPhotoUrl={setTempPhotoUrl}
                userProfileData={userProfileData}
                onSetBestProfile={(bestProfile) =>
                  setForm({ ...form, bestProfile: bestProfile })
                }
              />
            </DialogHeader>
          </DialogContent>
        </Dialog> */}
      </div>
      <div className='grid gap-4'>
        <div>
          <Label className='text-sm font-medium' htmlFor='name'>
            Your name
          </Label>
          <Input
            className='rounded-lg'
            id='name'
            defaultValue={form?.name ?? ""}
            onChange={(e) => setForm({ ...form, name: e.target.value.trim() })}
            placeholder='chesterlacroix@pm.me'
          />
        </div>
        <div>
          <Label className='text-sm font-medium' htmlFor='email'>
            Your email
          </Label>
          <Input
            className='rounded-lg'
            id='email'
            disabled
            defaultValue={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value.trim() })}
            placeholder='chesterlacroix@pm.me'
          />
        </div>
        <div className='flex flex-col gap-2'>
          <Label className='text-sm font-medium' htmlFor='bio'>
            {`Short bio (<180 characters)`}
          </Label>
          <Textarea
            className='rounded-lg'
            maxLength={180}
            id='bio'
            value={form.bio}
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
          />
        </div>
      </div>

      <ProfileConnections
        setTempPhotoUrl={setTempPhotoUrl}
        userProfileData={userProfileData}
        onSetBestProfile={(bestProfile, image) => {
          setForm({ ...form, bestProfile: bestProfile });
          if (image) {
            setTempPhotoUrl(image);
          }
        }}
        onHandleLink={() => {
          // url encode all the current form data and push it to the path
          let params;

          if (pathname.includes("/profile")) {
            params = new URLSearchParams(
              Object.entries({
                ...form,
                editMode: "true",
              }).map(([key, value]) => [key, String(value)])
            );
          } else {
            params = new URLSearchParams({
              ...form,
              isAvailable: form.isAvailable.toString(),
              position: form.position.join(","),
              employmentType: form.employmentType.join(","),
            });
          }

          const formData = params.toString();
          const path = pathname + "?" + formData;
          router.push(path);
        }}
      />
      <>
        {" "}
        <div className='text-[#1e1e1e] text-sm font-bold font-heading leading-[14px] m-0 scroll-m-0 max-w-[360px]'>
          <p className='mb-1 leading-4'>READY TO APPEAR ON OUR TALENT PAGE?</p>
          <p className='text-xs text-gray-500 mb-3'>
            (your profile will be shared on our socials!)
          </p>
          <div className='flex gap-4 relative max-w-full'>
            <Button
              size='lg'
              className={`w-40 md:w-[180px] max-w-full rounded-[8px] font-heading font-bold uppercase justify-center text-center ${
                form.isAvailable === true
                  ? "bg-[#2640EB] hover:bg-blue-600 hover:text-white text-yellow-200"
                  : "border-[#D3D8FB] border-2 bg-[#fff] text-[#919CF4]"
              }`}
              onClick={() => handleButtonClick(true)}
            >
              YES!
            </Button>

            <Button
              size='icon'
              onClick={() =>
                form.isAvailable === false
                  ? handleButtonClick(true)
                  : handleButtonClick(false)
              }
              className='bg-transparent hover:bg-transparent active:scale-95 transition-all duration-100 absolute right-[45%]'
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='36'
                height='37'
                viewBox='0 0 36 37'
                fill='none'
              >
                <rect
                  x='1'
                  y='1.5'
                  width='34'
                  height='34'
                  rx='17'
                  fill='white'
                />
                <rect
                  x='1'
                  y='1.5'
                  width='34'
                  height='34'
                  rx='17'
                  stroke='#2640EB'
                  strokeWidth='2'
                />
                <path
                  d='M23.7826 21.6874L9.90039 21.6874L9.90039 22.9623L23.7826 22.9623L21.0512 25.6994L21.9537 26.6L26.2199 22.3248L21.9537 18.0497L21.0512 18.9503L23.7826 21.6874Z'
                  fill='#2640EB'
                />
                <path
                  d='M14.1664 10.4L9.90015 14.6751L14.1664 18.9503L15.0689 18.0497L12.3375 15.3126L26.2197 15.3126L26.2197 14.0377L12.3375 14.0377L15.0689 11.3006L14.1664 10.4Z'
                  fill='#2640EB'
                />
              </svg>
            </Button>
            <Button
              size='lg'
              className={`w-40 md:w-[180px] rounded-[8px] font-heading font-bold uppercase justify-center ${
                form.isAvailable === false
                  ? "bg-[#2640EB] text-white hover:bg-blue-600 hover:text-white"
                  : "border-[#D3D8FB] border-2 bg-[#fff] text-[#919CF4]"
              }`}
              onClick={() => handleButtonClick(false)}
            >
              MAYBE LATER
            </Button>
          </div>
        </div>
        {!isEditMode ? (
          <div className='w-[343px] text-center text-gray-700 text-sm font-semibold font-body leading-[21px] pt-5 '>
            If you&apos;re on our talent page and looking for work, having
            prospective companies and recruiters book a call with you is a great
            first step.
            <br />
            <br />
            (You can also do this later in settings).
          </div>
        ) : null}
        <div className='grid gap-4'>
          <div className='flex flex-col gap-2'>
            <Label className='text-sm font-medium' htmlFor='position'>
              Job title(s)
            </Label>
            {form.position?.map((job) => (
              <div className='flex gap-2' key={job}>
                <JobSelect
                  value={job}
                  onValueChange={(val) => {
                    // set the first position in the array without changing the rest
                    setForm({
                      ...form,
                      position: [val, ...form.position?.slice(1)],
                    });
                  }}
                />
                <Button
                  variant='link'
                  className='text-red-700 p-2'
                  onClick={() => {
                    setForm({
                      ...form,
                      position: form.position.filter(
                        (position) => position !== job
                      ),
                    });
                  }}
                >
                  <TrashIcon className='w-4 h-4 p-0' />
                </Button>
              </div>
            ))}
            {addPosition && (
              <JobSelect
                value={form.position[-1]}
                onValueChange={(val) => {
                  const newPositions = [...form.position, val];
                  // set the first position in the array without changing the rest
                  setForm({
                    ...form,
                    position: newPositions,
                  });
                  setAddPosition(false);
                }}
              />
            )}
          </div>
          {
            <Button
              variant='link'
              className='w-full mt-0 mb-2 py-0 h-fit text-blue-700'
              onClick={() => {
                setAddPosition(true);
              }}
            >
              + Add another
            </Button>
          }
          <div className='flex flex-col gap-2'>
            <Label className='text-sm font-medium' htmlFor='position'>
              Seeking
            </Label>
            {form.employmentType?.map((type) => (
              <div className='flex gap-2' key={type}>
                <JobTypeSelect
                  value={type}
                  onValueChange={(val) => {
                    setForm({
                      ...form,
                      employmentType: [val, ...form.employmentType?.slice(1)],
                    });
                  }}
                />
                <Button
                  variant='link'
                  className='text-red-700 p-2'
                  onClick={() => {
                    setForm({
                      ...form,
                      position: form.position.filter(
                        (position) => position !== type
                      ),
                    });
                  }}
                >
                  <TrashIcon className='w-4 h-4 p-0' />
                </Button>
              </div>
            ))}
            {addEmploymentType && (
              <JobTypeSelect
                value={form.employmentType[-1]}
                onValueChange={(val) => {
                  const newTypes = [...form.employmentType, val];
                  setForm({ ...form, employmentType: newTypes });
                  setAddEmploymentType(false);
                }}
              />
            )}
          </div>
          {
            <Button
              variant='link'
              className='w-full mt-0 mb-2 py-0 h-fit text-blue-700'
              onClick={() => {
                setAddEmploymentType(true);
              }}
            >
              + Add another
            </Button>
          }
          <div className='flex flex-col gap-2'>
            <Label className='text-sm font-medium' htmlFor='bestProfile'>
              Geography
            </Label>
            <SelectComposed
              placeholder='Select geography'
              value={form.geography}
              onValueChange={(val) => {
                setForm({ ...form, geography: val });
              }}
              options={jobSalaryOptions?.salaryDetails.locations}
            />
          </div>
          {/* {jobSalary?.success ? (
            // display the salary range and ask if it looks right, too high, or too low
            <>
              <div className='space-y-4 border p-4 rounded-md shadow-sm bg-white'>
                <div className='space-y-2'>
                  <Label
                    className='text-sm font-medium text-gray-700'
                    htmlFor='bestProfile'
                  >
                    Salary Range
                  </Label>
                  <div className='grid grid-cols-2 gap-y-1'>
                    <p className='text-sm font-medium text-gray-600'>Min:</p>
                    <p className='text-sm font-medium'>
                      {`${new Intl.NumberFormat(
                        jobSalary.salaryRange?.currency,
                        {
                          style: "currency",
                          currency: jobSalary.salaryRange?.currency,
                        }
                      )}`}
                    </p>
                    <p className='text-sm font-medium text-gray-600'>Max:</p>
                    <p className='text-sm font-medium'>
                      {jobSalary.salaryRange?.new_max}
                    </p>
                    <p className='text-sm font-medium text-gray-600'>Median:</p>
                    <p className='text-sm font-medium'>
                      {jobSalary.salaryRange?.new_mid}
                    </p>
                  </div>
                </div>
                <hr className='border-gray-200' />
                <div className='space-y-2'>
                  <Label
                    className='text-sm font-medium text-gray-700'
                    htmlFor='bestProfile'
                  >
                    Does this look right?
                  </Label>
                  <div className='flex gap-4'>
                    <Button
                      variant='link'
                      className='text-sm text-red-700 hover:underline'
                      onClick={() => {
                        // set the salary range to the form
                      }}
                    >
                      Too low
                    </Button>
                    <Button
                      variant='link'
                      className='text-sm text-green-700 hover:underline'
                      onClick={() => {
                        // set the salary range to the form
                      }}
                    >
                      Just right
                    </Button>
                    <Button
                      variant='link'
                      className='text-sm text-red-700 hover:underline'
                      onClick={() => {
                        // set the salary range to the form
                      }}
                    >
                      Too high
                    </Button>
                  </div>
                </div>
              </div>
            </>
          ) : null} */}
        </div>
        <Button
          className='w-full text-sm font-body font-medium leading-[21px] mt-4 bg-[#2640eb]'
          disabled={
            isLoading ||
            (form.isAvailable && (!form.position[0] || !form.employmentType[0]))
          }
          onClick={async () => {
            setIsLoading(true);
            try {
              await onSubmit({ ...form, tempPhotoUrl });
              onClose && onClose();
            } catch (error) {
              console.error(error);
            } finally {
              setIsLoading(false);
            }
          }}
        >
          {isLoading ? (
            <LoaderIcon className='w-6 h-6 m-auto animate-spin' />
          ) : !isEditMode ? (
            "Save and continue to Interested"
          ) : (
            "Save and exit"
          )}
        </Button>
      </>
    </>
  );
};
