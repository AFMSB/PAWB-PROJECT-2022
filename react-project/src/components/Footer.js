import React, { Component } from 'react';

class Footer extends Component {
    render() {
        return (
            <footer className="py-3 my-4 bg-light">
                <ul className="nav justify-content-center border-bottom pb-3 mb-3">
                    <li className="nav-item"><a target="_blank" href="https://www.linkedin.com/in/andre-filipe-batista/" className="nav-link px-2 text-muted">André Batista</a></li>
                    <li className="nav-item"><a target="_blank" href="https://www.linkedin.com/in/jorge-lopes-pt/" className="nav-link px-2 text-muted">Jorge Lopes</a></li>
                </ul>
                <p className="text-center text-muted">© 2022 Universidade Fernando Pessoa, UFP</p>
            </footer>
        );
    }
}

export default Footer;