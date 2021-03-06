module.exports = {
    ensureAuthenticated: (req, res, next) => {
        if (req.isAuthenticated()) {
            return next();
        } else {
            req.flash('error', 'Not authorized');
            res.redirect('/users/login');
        }
    },
};
