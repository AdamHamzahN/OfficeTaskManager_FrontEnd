"use client";

import React from "react";
import {Button, Card} from "antd";
import {store} from "#/store";
import { useParams } from "next/navigation";

const Page = () => {
    const params = useParams();
    const idUser = params?.idUser as string | undefined;
    const idProject = params?.idProject as string | undefined;
    return <div>
       {`${idUser} | ${idProject}`}
    </div>;
};

export default Page;

