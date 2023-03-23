import clsx from 'clsx';
import React from 'react';
import styles from './HomepageFeatures.module.css';

type FeatureItem = {
  title: string;
  image: string;
  description: JSX.Element;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Fast & Easy Setup',
    image: '⏱ ',
    description: <>Create your own Store and Effects in a Single file.</>,
  },
  {
    title: 'Integrated loading state',
    image: '⏳',
    description: <>Every created Effects set and reset an Loading state</>,
  },
  {
    title: 'Support Redux Devtools',
    image: '⚒️',
    description: (
      <>
        Effects and State Changes will be shown in the Redux Devtools (if
        ReduxDevTool is enabled )
      </>
    ),
  },
  {
    title: 'Support session/locale Storage',
    image: '💽 ',
    description: <>Configure your store as session or local Store</>,
  },
];

function Feature({ title, image, description }: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <span style={{ fontSize: '100px' }}>{image}</span>
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
