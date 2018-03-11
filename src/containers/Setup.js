import { connect } from 'react-redux'
import { Setup as component } from '../components/Setup';
import { fetchScripts, saveScript, updateScript, deleteScript } from '../actions/custom';

const mapStateToProps = (state, props) => {
    return {
        scripts: state.custom.scripts,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        fetchScripts: () => dispatch(fetchScripts()),
        saveScript: (script) => dispatch(saveScript(script)),
        updateScript: (script) => dispatch(updateScript(script)),
        deleteScript: (script_id) => dispatch(deleteScript(script_id)),
    }
}

const Setup = connect(
    mapStateToProps,
    mapDispatchToProps
)(component)

export default Setup
