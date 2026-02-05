import { redirect } from 'next/navigation';

export default function Home() {
  // If user hits "/", send them to "/dashboard"
  // The Dashboard layout will then check if they are logged in
  redirect('/dashboard');
}