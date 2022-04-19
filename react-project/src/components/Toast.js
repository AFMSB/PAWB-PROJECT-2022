import React from 'react';

export class Toast extends React.Component {
    closeToastHandler(e) {
        e.target.parentElement.parentElement.classList.add("d-none");
    }

    render() {
        const { toasts } = this.props;

        return toasts && toasts.map((toast, index) =>
            <div key={index} className="toast d-block" role="alert" aria-live="assertive" aria-atomic="true">
                <div className="toast-header">
                    <img src="" className="rounded me-2" alt="..."/>
                    <strong className="me-auto">{toast.sender}</strong>
                    <small className="text-muted">just now</small>
                    <button type="button" className="btn-close" data-bs-dismiss="toast"
                            aria-label="Close" onClick={e => this.closeToastHandler(e)}></button>
                </div>
                <div className="toast-body">
                    {toast.body}
                </div>
            </div>
        );
    }
}