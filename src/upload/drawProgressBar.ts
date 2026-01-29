const readline = require("readline");

export const drawProgressBar = (progress: number, extra?: string) => {
  const barLength = 30;
  const completedLength = Math.round(barLength * progress);
  const remainingLength = barLength - completedLength;
  const progressBar = "█".repeat(completedLength) + "-".repeat(remainingLength);
  readline.cursorTo(process.stdout, 0);
  readline.clearLine(process.stdout, 0);
  const extraInfo = extra ? ` ${extra}` : "";
  process.stdout.write(`[${progressBar}] ${Math.round(progress * 100)}%${extraInfo}`);
};

// function updateProgress(progress: number) {
//   drawProgressBar(progress);
//   if (progress >= 1) {
//     process.stdout.write("\n");
//     clearInterval(progressInterval);
//     console.log("完成", progress);
//   }
// }
// let progressInterval: NodeJS.Timer;
// (() => {
//   console.log("开始");
//   let progress = 0;
//   progressInterval = setInterval(() => {
//     progress += 0.05; // Increase progress by 5% each time (adjust as needed)
//     updateProgress(progress);
//   }, 500); // Update every 500ms (adjust as needed)
// })();
