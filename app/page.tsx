import { GitGarden } from "@/components/git-garden";
import { generateDemoGarden } from "@/lib/garden";

export default function Home() {
  const year = new Date().getFullYear();
  return <GitGarden initialGarden={generateDemoGarden("octocat", year)} />;
}
