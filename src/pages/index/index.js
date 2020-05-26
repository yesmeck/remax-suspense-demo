import * as React from 'react';
import { View } from 'remax/ali';
import './index.css';

function delay(ms) {
  if (typeof ms !== 'number') {
    throw new Error('Must specify ms');
  }
  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
}

function createTextResource(ms, text) {
  let status = 'pending';
  let result;

  const suspender = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(text);
    }, ms);
  }).then(
    r => {
      status = 'success';
      result = r;
    },
    e => {
      status = 'error';
      result = e;
    }
  );

  return {
    read() {
      if (status === 'pending') {
        throw suspender;
      }

      if (status === 'error') {
        throw result;
      }
      return result;
    },
  };
}

const SyncText = props => {
  return props.text;
};

const AsyncText = props => {
  props.resource.read();
  return props.text;
};

const Suspense = React.Suspense;

export default () => {
  return (
    <View>
      <Suspense fallback={<SyncText text="loading" />}>
        <View>
          <SyncText text="A" />
        </View>
        <View>
          <AsyncText resource={createTextResource(599, 'B')} text="B" />
        </View>
        <View style={{ display: 'inline' }}>
          <SyncText text="C" />
        </View>
      </Suspense>
    </View>
  );
};
