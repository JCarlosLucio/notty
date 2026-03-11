function GradientBlobs() {
  return (
    <div className="absolute top-0 left-0 z-[-1] h-full w-full overflow-hidden blur-[150px]">
      <div className="animate-gradient-blob-1 absolute top-1/3 left-2/3 z-[-3] h-75 w-75 rounded-full bg-teal-400 opacity-60 mix-blend-screen xl:h-150 xl:w-150 dark:bg-cyan-400" />
      <div className="animate-gradient-blob-2 absolute top-1/3 left-1/3 z-[-2] h-50 w-50 rounded-full bg-emerald-400 opacity-60 mix-blend-screen xl:h-125 xl:w-125 dark:bg-emerald-600" />
      <div className="animate-gradient-blob-3 absolute top-1/2 left-1/2 z-[-4] h-25 w-25 rounded-full bg-green-400 opacity-60 mix-blend-screen xl:h-100 xl:w-100 dark:bg-teal-700" />
    </div>
  );
}

export default GradientBlobs;
