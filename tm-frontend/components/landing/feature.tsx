import React from "react";

export type FeatureProps = {
  title: string;
  desc: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

const Feature: React.FC<FeatureProps> = ({ title, desc, icon: Icon }) => {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 transition hover:shadow-md">
      <Icon className="mb-4 h-6 w-6 text-blue-600" />
      <h3 className="mb-2 font-semibold">{title}</h3>
      <p className="text-sm text-gray-600">{desc}</p>
    </div>
  );
};

export default Feature;
