"use client";

import React, {useEffect} from 'react';
import {useRouter} from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    if(router) {
      router.push('/login');
    }
  }, [router]);

  return (
    <div style={{}}>
    </div>
  );
}
