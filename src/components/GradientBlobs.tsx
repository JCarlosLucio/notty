const GradientBlobs = () => {
  return (
    <div className="absolute left-0 top-0 z-[-1] h-full w-full overflow-hidden blur-[150px]">
      <div className="absolute left-2/3 top-1/3 z-[-3] h-[300px] w-[300px] animate-gradient-blob-1 rounded-full bg-teal-400 opacity-60 mix-blend-screen dark:bg-cyan-400 xl:h-[600px] xl:w-[600px]" />
      <div className="absolute left-1/3 top-1/3 z-[-2] h-[200px] w-[200px] animate-gradient-blob-2 rounded-full bg-emerald-400 opacity-60 mix-blend-screen dark:bg-emerald-600 xl:h-[500px] xl:w-[500px]" />
      <div className="absolute left-1/2 top-1/2 z-[-4] h-[100px] w-[100px] animate-gradient-blob-3 rounded-full bg-green-400 opacity-60 mix-blend-screen dark:bg-teal-700 xl:h-[400px] xl:w-[400px]" />
    </div>
  );
};

export default GradientBlobs;
