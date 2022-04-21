import React from 'react';

export class Toast extends React.Component {
    closeToastHandler(e) {
        e.target.parentElement.parentElement.classList.add("d-none");
    }

    render() {
        const {toasts} = this.props;

        return toasts && toasts.map((toast, index) =>
            <div key={index} className="toast d-block" role="alert" aria-live="assertive" aria-atomic="true">
                <div className="toast-header">
                    <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor'
                         className='bi bi-bell notify-icon rounded me-2' viewBox='0 0 16 16'>
                        <path
                            d='M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2zM8 1.918l-.797.161A4.002 4.002 0 0 0 4 6c0 .628-.134 2.197-.459 3.742-.16.767-.376 1.566-.663 2.258h10.244c-.287-.692-.502-1.49-.663-2.258C12.134 8.197 12 6.628 12 6a4.002 4.002 0 0 0-3.203-3.92L8 1.917zM14.22 12c.223.447.481.801.78 1H1c.299-.199.557-.553.78-1C2.68 10.2 3 6.88 3 6c0-2.42 1.72-4.44 4.005-4.901a1 1 0 1 1 1.99 0A5.002 5.002 0 0 1 13 6c0 .88.32 4.2 1.22 6z'/>
                    </svg>
                    <strong className="me-auto">Server</strong>
                    <small className="text-muted">just now</small>
                    <button type="button" className="btn-close" data-bs-dismiss="toast"
                            aria-label="Close" onClick={e => this.closeToastHandler(e)}/>
                </div>
                <div className="toast-body">
                    {toast}
                </div>
            </div>
        );
    }
}