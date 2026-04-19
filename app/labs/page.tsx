import Link from "next/link";
export default function labs() {
  const serverRootUrl = process.env.NEXT_PUBLIC_HTTP_SERVER;
  return (
    <div id="wd-labs">
      <h1>Labs</h1>
      <p>Vilius Dziugelis | CS4450 - Jose Annunziato</p>
      <p>Daniel McCue | CS4450 - Jose Annunziato</p>
      <ul>
        <li>
          <Link href="/labs/lab1" id="wd-lab1-link">
            Lab 1: HTML Examples </Link>
        </li>
        <li>
          <Link href="/labs/lab2" id="wd-lab2-link">
            Lab 2: CSS Basics </Link>
        </li>
        <li>
          <Link href="/labs/lab3" id="wd-lab3-link">
            Lab 3: JavaScript Fundamentals </Link>
        </li>
        <li>
          <Link href="/labs/lab4" id="wd-lab4-link">
            Lab 4: State Management </Link>
        </li>
        <li>
          <Link href="/labs/lab5" id="wd-lab5-link">
            Lab 5: REST APIs with Express </Link>
        </li>
        <li>
          <a
            href="https://github.com/vildzi/cs4550a1/tree/quizzes"
            id="wd-github-link"
            target="_blank"
            rel="noreferrer"
          >
            GitHub Repository
          </a>
        </li>
        <li>
          <a
            href="https://github.com/vildzi/kambaz-node-server-app/tree/quizzes"
            id="wd-github-link-backend"
            target="_blank"
            rel="noreferrer"
          >
            Backend GitHub Repository
          </a>
        </li>
        <li>
          <a
            href={serverRootUrl}
            id="wd-server-root-link"
            target="_blank"
            rel="noreferrer"
          >
            Server Root URL
          </a>
        </li>
        <li>
          <Link href="/" id="wd-kambaz-link">
            Kambaz
          </Link>
        </li>
      </ul>
    </div>
  );
}
