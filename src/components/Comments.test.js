import React from 'react';
import ReactDOM from 'react-dom';
import Comments from './Comments';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Comments />, div);
  ReactDOM.unmountComponentAtNode(div);
});
