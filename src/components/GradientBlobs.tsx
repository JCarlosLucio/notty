function GradientBlobs() {
  return (
    <div className="absolute top-0 left-0 z-[-1] h-full w-full overflow-hidden blur-[150px]">
      <div className="animate-gradient-blob-1 absolute top-1/3 left-2/3 z-[-3] h-[300px] w-[300px] rounded-full bg-teal-400 opacity-60 mix-blend-screen xl:h-[600px] xl:w-[600px] dark:bg-cyan-400" />
      <div className="animate-gradient-blob-2 absolute top-1/3 left-1/3 z-[-2] h-[200px] w-[200px] rounded-full bg-emerald-400 opacity-60 mix-blend-screen xl:h-[500px] xl:w-[500px] dark:bg-emerald-600" />
      <div className="animate-gradient-blob-3 absolute top-1/2 left-1/2 z-[-4] h-[100px] w-[100px] rounded-full bg-green-400 opacity-60 mix-blend-screen xl:h-[400px] xl:w-[400px] dark:bg-teal-700" />
    </div>
  );
}

export default GradientBlobs;
